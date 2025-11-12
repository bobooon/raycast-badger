"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/manage.tsx
var manage_exports = {};
__export(manage_exports, {
  default: () => Manage
});
module.exports = __toCommonJS(manage_exports);
var import_api3 = require("@raycast/api");
var import_react2 = require("react");

// src/utils/create.tsx
var import_api2 = require("@raycast/api");
var import_react = require("react");

// src/utils/storage.ts
var import_api = require("@raycast/api");
var locale = Intl.DateTimeFormat().resolvedOptions().locale;
async function getApps() {
  return (await (0, import_api.getApplications)()).filter((app) => typeof app.bundleId === "string").sort((a, b) => a.name.localeCompare(b.name, locale, { sensitivity: "base" }));
}
async function getStorage() {
  const apps = await getApps();
  const bundleIds = new Set(apps.map((app) => app.bundleId));
  try {
    return JSON.parse(await import_api.LocalStorage.getItem("badges") || "[]").filter((badge) => bundleIds.has(badge.app.bundleId));
  } catch {
    return [];
  }
}
async function setStorage(badges) {
  await import_api.LocalStorage.setItem("badges", JSON.stringify(
    badges.sort((a, b) => a.app.name.localeCompare(b.app.name, locale, { sensitivity: "base" }))
  ));
}
async function addBadge(bundleId) {
  const app = (await getApps()).find((app2) => app2.bundleId === bundleId);
  const badges = await getStorage();
  if (!app || badges.some((badge) => badge.app.bundleId === bundleId))
    return;
  badges.push({ app });
  await setStorage(badges);
}
async function deleteBadge(bundleId) {
  await setStorage((await getStorage()).filter((badge) => badge.app.bundleId !== bundleId));
}

// src/utils/create.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Create(props) {
  const { pop } = (0, import_api2.useNavigation)();
  const [loaded, setLoaded] = (0, import_react.useState)(false);
  const [apps, setApps] = (0, import_react.useState)([]);
  (0, import_react.useEffect)(() => {
    (async () => {
      setApps(await getApps());
      setLoaded(true);
    })();
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_api2.Form,
    {
      isLoading: !loaded,
      navigationTitle: "Create Badge",
      actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api2.Action.SubmitForm,
        {
          title: "Submit",
          onSubmit: (values) => addBadge(values.bundleId).then(props.onSubmit).then(pop)
        }
      ) }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Form.Dropdown, { id: "bundleId", title: "Application", children: apps.map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_api2.Form.Dropdown.Item,
          {
            value: app.bundleId,
            title: app.name,
            icon: { fileIcon: app.path }
          },
          app.bundleId
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Form.Description, { text: "Applications must be open or kept in the Dock to count badges. Additionally, Raycast must have Automation and Accessibility permissions enabled." })
      ]
    }
  );
}

// src/manage.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function Manage() {
  const { push } = (0, import_api3.useNavigation)();
  const [loaded, setLoaded] = (0, import_react2.useState)(false);
  const [badges, setBadges] = (0, import_react2.useState)([]);
  (0, import_react2.useEffect)(() => {
    (async () => {
      setBadges(await getStorage());
      setLoaded(true);
    })();
  }, []);
  const reload = async () => setBadges(await getStorage());
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_api3.List, { isLoading: !loaded, children: [
    badges.map((badge) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_api3.List.Item,
      {
        title: badge.app.name,
        icon: { fileIcon: badge.app.path },
        accessories: [{ text: badge.app.path }],
        actions: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_api3.ActionPanel, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            import_api3.Action,
            {
              title: "Create Badge",
              icon: import_api3.Icon.Plus,
              onAction: () => push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Create, { onSubmit: reload }))
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api3.ActionPanel.Section, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            import_api3.Action,
            {
              title: "Delete Badge",
              icon: import_api3.Icon.Trash,
              style: import_api3.Action.Style.Destructive,
              shortcut: { modifiers: ["ctrl"], key: "x" },
              onAction: () => (0, import_api3.confirmAlert)({
                title: badge.app.name,
                message: "Are you sure you want to delete this badge?",
                primaryAction: {
                  title: "Delete",
                  style: import_api3.Alert.ActionStyle.Destructive,
                  onAction: async () => {
                    await deleteBadge(badge.app.bundleId);
                    await reload();
                  }
                }
              })
            }
          ) })
        ] })
      },
      badge.app.bundleId
    )),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_api3.List.EmptyView,
      {
        icon: import_api3.Icon.BellDisabled,
        actions: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api3.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          import_api3.Action,
          {
            title: "Create Badge",
            icon: import_api3.Icon.Plus,
            onAction: () => push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Create, { onSubmit: reload }))
          }
        ) })
      }
    )
  ] });
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vLi4vLi4vVm9sdW1lcy9EYXRhL2NvbnRhaW5lcnMvbGFicy9wbHVnaW5zL3JheWNhc3QtYmFkZ2VzL3NyYy9tYW5hZ2UudHN4IiwgIi4uLy4uLy4uLy4uLy4uLy4uL1ZvbHVtZXMvRGF0YS9jb250YWluZXJzL2xhYnMvcGx1Z2lucy9yYXljYXN0LWJhZGdlcy9zcmMvdXRpbHMvY3JlYXRlLnRzeCIsICIuLi8uLi8uLi8uLi8uLi8uLi9Wb2x1bWVzL0RhdGEvY29udGFpbmVycy9sYWJzL3BsdWdpbnMvcmF5Y2FzdC1iYWRnZXMvc3JjL3V0aWxzL3N0b3JhZ2UudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB0eXBlIHsgQmFkZ2UgfSBmcm9tICcuL3V0aWxzL3N0b3JhZ2UudHMnXG5pbXBvcnQgeyBBY3Rpb24sIEFjdGlvblBhbmVsLCBBbGVydCwgY29uZmlybUFsZXJ0LCBJY29uLCBMaXN0LCB1c2VOYXZpZ2F0aW9uIH0gZnJvbSAnQHJheWNhc3QvYXBpJ1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQ3JlYXRlIH0gZnJvbSAnLi91dGlscy9jcmVhdGUudHN4J1xuaW1wb3J0IHsgZGVsZXRlQmFkZ2UsIGdldFN0b3JhZ2UgfSBmcm9tICcuL3V0aWxzL3N0b3JhZ2UudHMnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1hbmFnZSgpIHtcbiAgY29uc3QgeyBwdXNoIH0gPSB1c2VOYXZpZ2F0aW9uKClcbiAgY29uc3QgW2xvYWRlZCwgc2V0TG9hZGVkXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbYmFkZ2VzLCBzZXRCYWRnZXNdID0gdXNlU3RhdGU8QmFkZ2VbXT4oW10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgc2V0QmFkZ2VzKGF3YWl0IGdldFN0b3JhZ2UoKSlcbiAgICAgIHNldExvYWRlZCh0cnVlKVxuICAgIH0pKClcbiAgfSwgW10pXG5cbiAgY29uc3QgcmVsb2FkID0gYXN5bmMgKCkgPT4gc2V0QmFkZ2VzKGF3YWl0IGdldFN0b3JhZ2UoKSlcblxuICByZXR1cm4gKFxuICAgIDxMaXN0IGlzTG9hZGluZz17IWxvYWRlZH0+XG4gICAgICB7YmFkZ2VzLm1hcChiYWRnZSA9PiAoXG4gICAgICAgIDxMaXN0Lkl0ZW1cbiAgICAgICAgICBrZXk9e2JhZGdlLmFwcC5idW5kbGVJZH1cbiAgICAgICAgICB0aXRsZT17YmFkZ2UuYXBwLm5hbWV9XG4gICAgICAgICAgaWNvbj17eyBmaWxlSWNvbjogYmFkZ2UuYXBwLnBhdGggfX1cbiAgICAgICAgICBhY2Nlc3Nvcmllcz17W3sgdGV4dDogYmFkZ2UuYXBwLnBhdGggfV19XG4gICAgICAgICAgYWN0aW9ucz17KFxuICAgICAgICAgICAgPEFjdGlvblBhbmVsPlxuICAgICAgICAgICAgICA8QWN0aW9uXG4gICAgICAgICAgICAgICAgdGl0bGU9XCJDcmVhdGUgQmFkZ2VcIlxuICAgICAgICAgICAgICAgIGljb249e0ljb24uUGx1c31cbiAgICAgICAgICAgICAgICBvbkFjdGlvbj17KCkgPT4gcHVzaCg8Q3JlYXRlIG9uU3VibWl0PXtyZWxvYWR9IC8+KX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPEFjdGlvblBhbmVsLlNlY3Rpb24+XG4gICAgICAgICAgICAgICAgPEFjdGlvblxuICAgICAgICAgICAgICAgICAgdGl0bGU9XCJEZWxldGUgQmFkZ2VcIlxuICAgICAgICAgICAgICAgICAgaWNvbj17SWNvbi5UcmFzaH1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtBY3Rpb24uU3R5bGUuRGVzdHJ1Y3RpdmV9XG4gICAgICAgICAgICAgICAgICBzaG9ydGN1dD17eyBtb2RpZmllcnM6IFsnY3RybCddLCBrZXk6ICd4JyB9fVxuICAgICAgICAgICAgICAgICAgb25BY3Rpb249eygpID0+IGNvbmZpcm1BbGVydCh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBiYWRnZS5hcHAubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBiYWRnZT8nLFxuICAgICAgICAgICAgICAgICAgICBwcmltYXJ5QWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdEZWxldGUnLFxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiBBbGVydC5BY3Rpb25TdHlsZS5EZXN0cnVjdGl2ZSxcbiAgICAgICAgICAgICAgICAgICAgICBvbkFjdGlvbjogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGVsZXRlQmFkZ2UoYmFkZ2UuYXBwLmJ1bmRsZUlkKVxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgcmVsb2FkKClcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9BY3Rpb25QYW5lbC5TZWN0aW9uPlxuICAgICAgICAgICAgPC9BY3Rpb25QYW5lbD5cbiAgICAgICAgICApfVxuICAgICAgICAvPlxuICAgICAgKSl9XG5cbiAgICAgIDxMaXN0LkVtcHR5Vmlld1xuICAgICAgICBpY29uPXtJY29uLkJlbGxEaXNhYmxlZH1cbiAgICAgICAgYWN0aW9ucz17KFxuICAgICAgICAgIDxBY3Rpb25QYW5lbD5cbiAgICAgICAgICAgIDxBY3Rpb25cbiAgICAgICAgICAgICAgdGl0bGU9XCJDcmVhdGUgQmFkZ2VcIlxuICAgICAgICAgICAgICBpY29uPXtJY29uLlBsdXN9XG4gICAgICAgICAgICAgIG9uQWN0aW9uPXsoKSA9PiBwdXNoKDxDcmVhdGUgb25TdWJtaXQ9e3JlbG9hZH0gLz4pfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0FjdGlvblBhbmVsPlxuICAgICAgICApfVxuICAgICAgLz5cbiAgICA8L0xpc3Q+XG4gIClcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEJhZGdlQXBwbGljYXRpb24gfSBmcm9tICcuL3N0b3JhZ2UudHMnXG5pbXBvcnQgeyBBY3Rpb24sIEFjdGlvblBhbmVsLCBGb3JtLCB1c2VOYXZpZ2F0aW9uIH0gZnJvbSAnQHJheWNhc3QvYXBpJ1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgYWRkQmFkZ2UsIGdldEFwcHMgfSBmcm9tICcuL3N0b3JhZ2UudHMnXG5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGUocHJvcHM6IHsgb25TdWJtaXQ6ICgpID0+IFByb21pc2U8dm9pZD4gfSkge1xuICBjb25zdCB7IHBvcCB9ID0gdXNlTmF2aWdhdGlvbigpXG4gIGNvbnN0IFtsb2FkZWQsIHNldExvYWRlZF0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2FwcHMsIHNldEFwcHNdID0gdXNlU3RhdGU8QmFkZ2VBcHBsaWNhdGlvbltdPihbXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIChhc3luYyAoKSA9PiB7XG4gICAgICBzZXRBcHBzKGF3YWl0IGdldEFwcHMoKSlcbiAgICAgIHNldExvYWRlZCh0cnVlKVxuICAgIH0pKClcbiAgfSwgW10pXG5cbiAgcmV0dXJuIChcbiAgICA8Rm9ybVxuICAgICAgaXNMb2FkaW5nPXshbG9hZGVkfVxuICAgICAgbmF2aWdhdGlvblRpdGxlPVwiQ3JlYXRlIEJhZGdlXCJcbiAgICAgIGFjdGlvbnM9eyhcbiAgICAgICAgPEFjdGlvblBhbmVsPlxuICAgICAgICAgIDxBY3Rpb24uU3VibWl0Rm9ybVxuICAgICAgICAgICAgdGl0bGU9XCJTdWJtaXRcIlxuICAgICAgICAgICAgb25TdWJtaXQ9eyh2YWx1ZXM6IHsgYnVuZGxlSWQ6IHN0cmluZyB9KSA9PiBhZGRCYWRnZSh2YWx1ZXMuYnVuZGxlSWQpLnRoZW4ocHJvcHMub25TdWJtaXQpLnRoZW4ocG9wKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0FjdGlvblBhbmVsPlxuICAgICAgKX1cbiAgICA+XG4gICAgICA8Rm9ybS5Ecm9wZG93biBpZD1cImJ1bmRsZUlkXCIgdGl0bGU9XCJBcHBsaWNhdGlvblwiPlxuICAgICAgICB7YXBwcy5tYXAoYXBwID0+IChcbiAgICAgICAgICA8Rm9ybS5Ecm9wZG93bi5JdGVtXG4gICAgICAgICAgICBrZXk9e2FwcC5idW5kbGVJZH1cbiAgICAgICAgICAgIHZhbHVlPXthcHAuYnVuZGxlSWR9XG4gICAgICAgICAgICB0aXRsZT17YXBwLm5hbWV9XG4gICAgICAgICAgICBpY29uPXt7IGZpbGVJY29uOiBhcHAucGF0aCB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICkpfVxuICAgICAgPC9Gb3JtLkRyb3Bkb3duPlxuXG4gICAgICA8Rm9ybS5EZXNjcmlwdGlvbiB0ZXh0PVwiQXBwbGljYXRpb25zIG11c3QgYmUgb3BlbiBvciBrZXB0IGluIHRoZSBEb2NrIHRvIGNvdW50IGJhZGdlcy4gQWRkaXRpb25hbGx5LCBSYXljYXN0IG11c3QgaGF2ZSBBdXRvbWF0aW9uIGFuZCBBY2Nlc3NpYmlsaXR5IHBlcm1pc3Npb25zIGVuYWJsZWQuXCIgLz5cbiAgICA8L0Zvcm0+XG4gIClcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnQHJheWNhc3QvYXBpJ1xuaW1wb3J0IHsgZ2V0QXBwbGljYXRpb25zLCBMb2NhbFN0b3JhZ2UgfSBmcm9tICdAcmF5Y2FzdC9hcGknXG5cbmV4cG9ydCBpbnRlcmZhY2UgQmFkZ2VBcHBsaWNhdGlvbiBleHRlbmRzIEFwcGxpY2F0aW9uIHtcbiAgYnVuZGxlSWQ6IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJhZGdlIHtcbiAgYXBwOiBCYWRnZUFwcGxpY2F0aW9uXG59XG5cbmNvbnN0IGxvY2FsZSA9IEludGwuRGF0ZVRpbWVGb3JtYXQoKS5yZXNvbHZlZE9wdGlvbnMoKS5sb2NhbGVcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEFwcHMoKSB7XG4gIHJldHVybiAoYXdhaXQgZ2V0QXBwbGljYXRpb25zKCkpXG4gICAgLmZpbHRlcigoYXBwKTogYXBwIGlzIEJhZGdlQXBwbGljYXRpb24gPT4gdHlwZW9mIGFwcC5idW5kbGVJZCA9PT0gJ3N0cmluZycpXG4gICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSwgbG9jYWxlLCB7IHNlbnNpdGl2aXR5OiAnYmFzZScgfSkpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTdG9yYWdlKCkge1xuICBjb25zdCBhcHBzID0gYXdhaXQgZ2V0QXBwcygpXG4gIGNvbnN0IGJ1bmRsZUlkcyA9IG5ldyBTZXQoYXBwcy5tYXAoYXBwID0+IGFwcC5idW5kbGVJZCkpXG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gKEpTT04ucGFyc2UoKGF3YWl0IExvY2FsU3RvcmFnZS5nZXRJdGVtKCdiYWRnZXMnKSkgfHwgJ1tdJykgYXMgQmFkZ2VbXSlcbiAgICAgIC5maWx0ZXIoYmFkZ2UgPT4gYnVuZGxlSWRzLmhhcyhiYWRnZS5hcHAuYnVuZGxlSWQpKVxuICB9XG4gIGNhdGNoIHtcbiAgICByZXR1cm4gW11cbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBzZXRTdG9yYWdlKGJhZGdlczogQmFkZ2VbXSkge1xuICBhd2FpdCBMb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYmFkZ2VzJywgSlNPTi5zdHJpbmdpZnkoXG4gICAgYmFkZ2VzLnNvcnQoKGEsIGIpID0+IGEuYXBwLm5hbWUubG9jYWxlQ29tcGFyZShiLmFwcC5uYW1lLCBsb2NhbGUsIHsgc2Vuc2l0aXZpdHk6ICdiYXNlJyB9KSksXG4gICkpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRCYWRnZShidW5kbGVJZDogc3RyaW5nKSB7XG4gIGNvbnN0IGFwcCA9IChhd2FpdCBnZXRBcHBzKCkpLmZpbmQoYXBwID0+IGFwcC5idW5kbGVJZCA9PT0gYnVuZGxlSWQpXG4gIGNvbnN0IGJhZGdlcyA9IGF3YWl0IGdldFN0b3JhZ2UoKVxuXG4gIGlmICghYXBwIHx8IGJhZGdlcy5zb21lKGJhZGdlID0+IGJhZGdlLmFwcC5idW5kbGVJZCA9PT0gYnVuZGxlSWQpKVxuICAgIHJldHVyblxuXG4gIGJhZGdlcy5wdXNoKHsgYXBwIH0pXG4gIGF3YWl0IHNldFN0b3JhZ2UoYmFkZ2VzKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlQmFkZ2UoYnVuZGxlSWQ6IHN0cmluZykge1xuICBhd2FpdCBzZXRTdG9yYWdlKChhd2FpdCBnZXRTdG9yYWdlKCkpLmZpbHRlcihiYWRnZSA9PiBiYWRnZS5hcHAuYnVuZGxlSWQgIT09IGJ1bmRsZUlkKSlcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBLElBQUFBLGNBQW9GO0FBQ3BGLElBQUFDLGdCQUFvQzs7O0FDRHBDLElBQUFDLGNBQXlEO0FBQ3pELG1CQUFvQzs7O0FDRHBDLGlCQUE4QztBQVU5QyxJQUFNLFNBQVMsS0FBSyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUU7QUFFdkQsZUFBc0IsVUFBVTtBQUM5QixVQUFRLFVBQU0sNEJBQWdCLEdBQzNCLE9BQU8sQ0FBQyxRQUFpQyxPQUFPLElBQUksYUFBYSxRQUFRLEVBQ3pFLEtBQUssQ0FBQyxHQUFHLE1BQU0sRUFBRSxLQUFLLGNBQWMsRUFBRSxNQUFNLFFBQVEsRUFBRSxhQUFhLE9BQU8sQ0FBQyxDQUFDO0FBQ2pGO0FBRUEsZUFBc0IsYUFBYTtBQUNqQyxRQUFNLE9BQU8sTUFBTSxRQUFRO0FBQzNCLFFBQU0sWUFBWSxJQUFJLElBQUksS0FBSyxJQUFJLFNBQU8sSUFBSSxRQUFRLENBQUM7QUFFdkQsTUFBSTtBQUNGLFdBQVEsS0FBSyxNQUFPLE1BQU0sd0JBQWEsUUFBUSxRQUFRLEtBQU0sSUFBSSxFQUM5RCxPQUFPLFdBQVMsVUFBVSxJQUFJLE1BQU0sSUFBSSxRQUFRLENBQUM7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
