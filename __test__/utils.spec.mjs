import test from "ava";

import { isAbsolute } from "../index.js";

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
