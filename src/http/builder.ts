import { IRequestBuilder, IResponseBuilder } from "./interface";
import { tryResolve } from "../di";

export class ResponseBuilder implements IResponseBuilder {
    resolve(response) {
        if (response.success) {
            return response.result;
        }
        throw response;
    }
}

export class JQueryAjaxBuilder implements IRequestBuilder {
    ResponseBuilder: IResponseBuilder;
    constructor(url: any, resbuilder?: IResponseBuilder) {
        if (!url) {
            throw new Error("url is required");
        }
        this.options.url = url;
        this.ResponseBuilder = resbuilder || new ResponseBuilder();
    }

    get $(): JQueryStatic {
        var jq = tryResolve("$") || window['jQuery'];
        if (!jq) {
            throw new Error("jquery is required");
        }
        return jq;
    }
    callbackParam = "callback";
    xhr: JQueryXHR;
    options: JQueryAjaxSettings = {
        contentType: "application/json",
        dataType: 'json',
    };

    /**
     * ����ajax����
     * @param key ������
     * @param options ����
     * @param replace �Ƿ��滻ԭֵ
     */
    set(key, options, replace = true) {
        if (replace) {
            this.options[key] = options;
        }
        else {
            this.options[key] = this.$.extend(null, this.options[key], options);
        }
        return this;
    }

    headers(headers) {
        return this.set("headers", headers)
    }
    /**
     * ����ajax����
     * @param options
     */
    private async httpRequest(options) {
        options = { ...this.options, ...options };
        this.xhr = this.$.ajax(options);
        var response = await this.xhr;
        return this.ResponseBuilder.resolve(response);
    }

    /**
     * GET ����
     * @param query,��ѯ����
     */
    get(query?) {
        return this.httpRequest({ type: "GET", data: query });
    }

    /**
     * POST ����
     * @param data
     */
    post(data?, json = true) {
        return this.httpRequest({
            type: "POST",
            data: json ? JSON.stringify(data) : data
        });
    }

    /**
     * PUT ����
     * @param data
     */
    put(data, json = true) {
        return this.httpRequest({
            type: "PUT",
            data: json ? JSON.stringify(data) : data
        });
    }

    /**
     * DELETE ����
     */
    remove(query?) {
        return this.httpRequest({ type: "DELETE", data: query });
    }

    /**
     * jsonp ����
     * @param query ��ѯ�ַ���
     * @param callbackParam �ص�������
     */
    jsonp(query, callbackParam?) {
        var url = "";
        if (this.options.url.indexOf('=?') == -1) {
            callbackParam = callbackParam || this.callbackParam;
            if (this.options.url.indexOf('?') == -1) {
                url += '?';
            } else {
                url += '&';
            }

            url += callbackParam + '=?';
        }
        return this.httpRequest({ url, dataType: "jsonp", data: query });
    }

    /**
     * ֹͣajax����
     */
    stop() {
        this.xhr.abort();
    }
}
