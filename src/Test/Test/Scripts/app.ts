﻿/// <reference path="../typings/index.d.ts"/>

import $ from "jquery";
import "ss-utils"; 
import { JsonServiceClient } from "servicestack-client";
//import { JsonServiceClient } from "./JsonServiceClient";

import {
    Hello, HelloResponse,
    GetRandomIds, GetRandomIdsResponse,
    HelloTypes,
    ReturnString, ReturnBytes, ReturnStream
} from "./Test.dtos";

function createUrl(path: string, params: any): string {
    for (var key in params) {
        path += path.indexOf('?') <= 0 ? "?" : "&";
        path += key + "=" + encodeURIComponent(params[key]);
    }
    return path;
}

var client = new JsonServiceClient("/");

$(document).bindHandlers({
    sayHello () {
        var request = new Hello();
        request.name = this.value;
        $.getJSON(createUrl("/hello", request), function (r: HelloResponse) {
            $("#helloResult").html(r.result);
        });
    },
    sayHelloRoute () {
        var request = new Hello();
        request.name = this.value;
        request.title = "Dr";
        $.getJSON($.ss.createUrl("/hello/{Name}", request), request, function (r: HelloResponse) {
            $("#helloRouteResult").html(r.result);
        });
    },
    generateIds () {
        if (isNaN(parseInt(this.value))) return;
        var request = new GetRandomIds();
        request.take = parseInt(this.value);
        $.getJSON(createUrl("/randomids", request), function (r: GetRandomIdsResponse) {
            var html = r.results.map(function (id) { return "<li>" + id + "</id>"; }).join('');
            $("#randomIdsResult").html("<ul>" + html + "</ul>");
        });
    },
    helloTypes () {
        var request = new HelloTypes();
        request.string = this.value;
        request.bool = false;
        request.int = 0;
        client.get(request).then((r) => {
            $("#helloTypesResult").html(JSON.stringify(r));
        });
    },
    rawString() {
        var request = new ReturnString();
        request.data = this.value;

        client.get(request)
            .then(text => {
                $("#rawStringResult").html(text);
            });
    },
    rawBytes() {
        const bytesToBase64 = (array) => btoa(String.fromCharCode.apply(null, new Uint8Array(array)));
        const base64ToBytes = (b64) => new Uint8Array(atob(b64).split("").map(c => c.charCodeAt(0)));
        const bytesToString = (array) => String.fromCharCode.apply(String, array);

        var request = new ReturnBytes();
        request.data = base64ToBytes(this.value);

        client.get(request)
            .then(bytes => {
                $("#rawBytesResult").html(bytesToBase64(bytes) + "<br/>" + bytesToString(bytes));
            });
    }
});