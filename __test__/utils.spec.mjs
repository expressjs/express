import test from "ava";

import { isAbsolute, etag, wetag } from "../index.js";

test("utils.etag(body, encoding)", (t) => {
  // should support strings
  t.assert(etag("express!"), '"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"');

  // should support utf8 strings
  // t.assert(etag("express❤", "utf8"), '"a-JBiXf7GyzxwcrxY4hVXUwa7tmks"');

  // should support buffer
  // t.assert(etag(Buffer.from("express!")), '"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"');

  // should support empty string
  t.assert(etag(""), '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"');
});

test("utils.wetag(body, encoding)", (t) => {
  // should support strings
  t.assert(wetag("express!"), 'W/"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"');

  // should support utf8 strings
  // t.assert(
  //   wetag("express❤", "utf8"),
  //   'W/"a-JBiXf7GyzxwcrxY4hVXUwa7tmks"'
  // );

  // should support buffer
  // t.assert(
  //   wetag(Buffer.from("express!")),
  //   'W/"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"'
  // );

  // should support empty string
  t.assert(wetag(""), 'W/"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"');
});

test("utils.isAbsolute()", (t) => {
  // should support windows
  t.assert(isAbsolute("c:\\"));
  t.assert(isAbsolute("c:/"));
  t.assert(!isAbsolute(":\\"));

  // should support windows unc
  t.assert(isAbsolute("\\\\foo\\bar"));

  // should support unices
  t.assert(isAbsolute("/foo/bar"));
  t.assert(!isAbsolute("foo/bar"));
});
