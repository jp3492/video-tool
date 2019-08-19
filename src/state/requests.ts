export const requests = {
  folders: {
    get: {
      api: "CONTENT",
      method: "get",
      url: "/folder"
    },
    patch: {
      api: "CONTENT",
      method: "patch",
      url: "/folder/" // need to overwtrite with id
    },
    post: {
      api: "CONTENT",
      method: "post",
      url: "/folder"
      // need to overwrite and add body
    },
    delete: {
      api: "CONTENT",
      method: "delete",
      url: "/folder/" // need to overwrite with id
    }
  },
  projects: {
    get: {
      api: "CONTENT",
      method: "get",
      url: "/project"
    },
    patch: {
      api: "CONTENT",
      method: "patch",
      url: "/project/" // need to overwtrite with id
    },
    post: {
      api: "CONTENT",
      method: "post",
      url: "/project"
      // need to overwrite and add body
    },
    delete: {
      api: "CONTENT",
      method: "delete",
      url: "/project/" // need to overwrite with id
    }
  },
}