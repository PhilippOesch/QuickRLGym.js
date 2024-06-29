import { mountSuspended } from "@nuxt/test-utils/runtime";
import { it, expect } from "vitest";
import { Button } from '#components'

it("can mount some component", async () => {
  const component = await mountSuspended(Button);
  expect(component).toBeTruthy();
});
