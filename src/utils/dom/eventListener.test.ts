import { describe, it, expect, vi } from "vitest";
import { bind, bindAll } from "./eventListener";

describe("event-listener", () => {
  describe("bind", () => {
    it("should bind an event listener and return a cleanup function", () => {
      const target = new EventTarget();
      const listener = vi.fn();
      const cleanup = bind(target, { type: "click", listener });

      const event = new Event("click");
      target.dispatchEvent(event);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(event);

      cleanup();

      target.dispatchEvent(event);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("should support options", () => {
      const target = new EventTarget();
      const listener = vi.fn();
      const options = { once: true };
      bind(target, { type: "click", listener, options });

      const event = new Event("click");
      target.dispatchEvent(event);
      target.dispatchEvent(event);

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe("bindAll", () => {
    it("should bind multiple event listeners and return a cleanup function for all", () => {
      const target = new EventTarget();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      const cleanup = bindAll(target, [
        { type: "click", listener: listener1 },
        { type: "mouseover", listener: listener2 },
      ]);

      const clickEvent = new Event("click");
      const mouseoverEvent = new Event("mouseover");

      target.dispatchEvent(clickEvent);
      target.dispatchEvent(mouseoverEvent);

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener1).toHaveBeenCalledWith(clickEvent);
      expect(listener2).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledWith(mouseoverEvent);

      cleanup();

      target.dispatchEvent(clickEvent);
      target.dispatchEvent(mouseoverEvent);

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it("should support shared options", () => {
      const target = new EventTarget();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      bindAll(
        target,
        [
          { type: "click", listener: listener1 },
          { type: "mouseover", listener: listener2 },
        ],
        { once: true },
      );

      const clickEvent = new Event("click");
      const mouseoverEvent = new Event("mouseover");

      target.dispatchEvent(clickEvent);
      target.dispatchEvent(clickEvent);
      target.dispatchEvent(mouseoverEvent);
      target.dispatchEvent(mouseoverEvent);

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });
});
