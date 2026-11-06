import assert from "node:assert/strict";
import { test } from "node:test";

import {
  AREA_FILTERS,
  AREAS,
  findStay,
  MOBILE_AREAS,
  MOBILE_STAYS,
  stayBookHref,
  STAYS,
} from "./stays.ts";

test("desktop keeps every area and stay", () => {
  assert.equal(STAYS.length, 24);
  assert.equal(AREAS.length, 3);
  assert.equal(AREA_FILTERS.length, 4);
});

test("stay keys are unique, so links resolve to one stay", () => {
  assert.equal(new Set(STAYS.map((s) => s.key)).size, STAYS.length);
});

test("mobile only shows the open area", () => {
  assert.equal(MOBILE_STAYS.length, 6);
  assert.ok(MOBILE_STAYS.every((s) => s.area === "bao-loc"));
  assert.deepEqual(
    MOBILE_AREAS.map((a) => a.key),
    ["bao-loc"]
  );
});

test("book link carries the stay, and the API home only when mapped", () => {
  const stay = findStay("may-trang");
  assert.ok(stay);
  assert.equal(stayBookHref(stay), "/book?stay=may-trang");
  assert.equal(
    stayBookHref({ ...stay, homeId: 3 }),
    "/book?stay=may-trang&home=3"
  );
});

test("unknown or missing stay keys find nothing", () => {
  assert.equal(findStay("nope"), undefined);
  assert.equal(findStay(null), undefined);
  assert.equal(findStay(undefined), undefined);
});
