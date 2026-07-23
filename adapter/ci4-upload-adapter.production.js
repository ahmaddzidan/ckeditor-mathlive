class CI4UploadAdapter {
  constructor(loader, options) {
    this.loader = loader;
    this.options = {
      uploadUrl: "",
      headers: {},
      params: {},
      withCredentials: false,
      timeoutMs: 30000,
      fileFieldName: "userfile",
      ...options,
    };
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        }),
    );
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());

    xhr.open("POST", this.options.uploadUrl, true);
    xhr.responseType = "json";
    xhr.timeout = Number(this.options.timeoutMs) || 30000;
    xhr.setRequestHeader("Accept", "application/json");
  }

  _initListeners(resolve, reject, file) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr.addEventListener("error", () => reject(genericErrorText));
    xhr.addEventListener("abort", () => reject("Upload aborted."));
    xhr.addEventListener("timeout", () => reject("Upload timeout."));

    xhr.addEventListener("load", () => {
      const response = this._getResponseData();
      this._refreshCsrfFromResponseHeader();

      if (xhr.status < 200 || xhr.status >= 300) {
        return reject(this._extractErrorMessage(response, genericErrorText));
      }

      if (!response || response.error) {
        return reject(this._extractErrorMessage(response, genericErrorText));
      }

      const uploadedUrl = this._resolveUploadedUrl(response);

      if (!uploadedUrl) {
        return reject(genericErrorText);
      }

      resolve({
        default: uploadedUrl,
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener("progress", (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  _sendRequest(file) {
    const headers = this.options.headers || {};
    const params = this.options.params || {};

    this._applyCsrfHeader();
    this._applyConfiguredHeaders(headers);

    this.xhr.withCredentials = Boolean(this.options.withCredentials);

    const data = new FormData();
    data.append(this.options.fileFieldName || "userfile", file);

    for (const paramName of Object.keys(params)) {
      data.append(paramName, params[paramName]);
    }

    this.xhr.send(data);
  }

  _getResponseData() {
    if (this.xhr.response && typeof this.xhr.response === "object") {
      return this.xhr.response;
    }

    const text = this.xhr.responseText;

    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (_error) {
      return { message: text };
    }
  }

  _refreshCsrfFromResponseHeader() {
    const csrfHeaderName = this._getCsrfHeaderName();

    if (!csrfHeaderName) {
      return;
    }

    const csrfHeaderValue = this.xhr.getResponseHeader(csrfHeaderName);

    if (!csrfHeaderValue) {
      return;
    }

    const csrfMeta = document.querySelector(`meta[name="${csrfHeaderName}"]`);

    if (csrfMeta) {
      csrfMeta.setAttribute("content", csrfHeaderValue);
    }

    if (typeof CSRF_TOKEN !== "undefined") {
      document
        .querySelectorAll(`input[name="${CSRF_TOKEN}"]`)
        .forEach((input) => {
          input.value = csrfHeaderValue;
        });
    }
  }

  _applyCsrfHeader() {
    const csrfHeaderName = this._getCsrfHeaderName();

    if (!csrfHeaderName) {
      return;
    }

    const csrfMeta = document.querySelector(`meta[name="${csrfHeaderName}"]`);
    const csrfValue = csrfMeta ? csrfMeta.getAttribute("content") : null;

    if (csrfValue) {
      this.xhr.setRequestHeader(csrfHeaderName, csrfValue);
    }
  }

  _applyConfiguredHeaders(headers) {
    for (const headerName of Object.keys(headers)) {
      const headerValue = headers[headerName];

      if (
        headerValue === undefined ||
        headerValue === null ||
        headerValue === ""
      ) {
        continue;
      }

      if (headerName.toLowerCase() === "content-type") {
        continue;
      }

      this.xhr.setRequestHeader(headerName, headerValue);
    }
  }

  _resolveUploadedUrl(response) {
    if (!response || typeof response !== "object") {
      return null;
    }

    return (
      response.url ||
      response.default ||
      (response.data && response.data.url) ||
      (response.data && response.data.default) ||
      null
    );
  }

  _getCsrfHeaderName() {
    return typeof CSRF_HEADER !== "undefined" && CSRF_HEADER
      ? CSRF_HEADER
      : null;
  }

  _extractErrorMessage(response, fallbackMessage) {
    if (!response) {
      return fallbackMessage;
    }

    if (typeof response === "string") {
      return response;
    }

    if (response.error && typeof response.error.message === "string") {
      return response.error.message;
    }

    if (
      response.error &&
      response.error.message &&
      typeof response.error.message === "object"
    ) {
      return Object.values(response.error.message)
        .map((value) => String(value))
        .join("\n");
    }

    if (typeof response.message === "string") {
      return response.message;
    }

    return fallbackMessage;
  }
}

function CI4UploadAdapterPlugin(editor) {
  const options = editor.config.get("CI4Upload");

  if (!options) {
    return;
  }

  if (!options.uploadUrl) {
    const warningText = "simple-upload-adapter-missing-uploadurl";

    if (typeof logWarning === "function") {
      logWarning(warningText);
    } else {
      console.warn(warningText);
    }

    return;
  }

  const fileRepository = editor.plugins.get("FileRepository");

  if (!fileRepository) {
    console.warn("simple-upload-adapter-missing-filerepository");
    return;
  }

  fileRepository.createUploadAdapter = (loader) => {
    return new CI4UploadAdapter(loader, options);
  };
}
