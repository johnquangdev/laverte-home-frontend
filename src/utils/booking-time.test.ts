import assert from "node:assert/strict";
import { test } from "node:test";

import { durationLabel, formatHold, holdSecondsLeft } from "./booking-time.ts";

const at = (s: string) => new Date(s);

test("duration reads in hours within a day", () => {
  assert.equal(
    durationLabel(at("2026-11-06T14:00"), at("2026-11-06T18:00")),
    "4 giờ"
  );
});

test("whole days read as days", () => {
  assert.equal(
    durationLabel(at("2026-11-06T14:00"), at("2026-11-07T14:00")),
    "1 ngày"
  );
  assert.equal(
    durationLabel(at("2026-11-06T14:00"), at("2026-11-08T14:00")),
    "2 ngày"
  );
});

test("an end at or before the start has no duration", () => {
  assert.equal(
    durationLabel(at("2026-11-06T18:00"), at("2026-11-06T14:00")),
    "—"
  );
  assert.equal(
    durationLabel(at("2026-11-06T14:00"), at("2026-11-06T14:00")),
    "—"
  );
});

test("no expiry means no hold timer", () => {
  assert.equal(holdSecondsLeft(null, 0), null);
});

test("hold counts down to the expiry and stops at zero", () => {
  const now = Date.parse("2026-11-06T10:00:00Z");
  assert.equal(holdSecondsLeft("2026-11-06T10:15:00Z", now), 900);
  assert.equal(holdSecondsLeft("2026-11-06T09:59:00Z", now), 0);
});

test("hold time prints as mm:ss", () => {
  assert.equal(formatHold(898), "14:58");
  assert.equal(formatHold(0), "00:00");
});
