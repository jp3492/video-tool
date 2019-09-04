import { REQUEST_TYPES } from './reducer'

export const requests = {
  folders: {
    get: {
      api: "CONTENT",
      method: "GET",
      url: "/folder",
      trackId: "getFolders"
    },
    patch: {
      api: "CONTENT",
      method: "PATCH",
      url: "/folder/",
      trackId: "patchFolder" // need to overwtrite with id
    },
    post: {
      api: "CONTENT",
      method: "POST",
      url: "/folder",
      trackId: "postFolder"
      // need to overwrite and add body
    },
    delete: {
      api: "CONTENT",
      method: "DELETE",
      url: "/folder/",
      trackId: "deleteFolder" // need to overwrite with id
    }
  },
  tags: {
    get: {
      api: "CONTENT",
      method: "GET",
      url: "/tag/",
      trackId: "getTags"
    },
    patch: {
      api: "CONTENT",
      method: "PATCH",
      url: "/tag/",
      trackId: "patchTag" // need to overwtrite with id
    },
    post: {
      api: "CONTENT",
      method: "POST",
      url: "/tag/",
      trackId: "postTag"
      // need to overwrite and add body
    },
    delete: {
      api: "CONTENT",
      method: "DELETE",
      url: "/tag/",
      trackId: "deleteTag" // need to overwrite with id
    }
  },
  projects: {
    get: {
      api: "CONTENT",
      method: "GET",
      url: "/project",
      trackId: "getProjects"
    },
    getSingle: {
      api: "CONTENT",
      method: "GET_SINGLE",
      url: "/project/",
      trackId: "getSingleProject"
    },
    patch: {
      api: "CONTENT",
      method: "PATCH",
      url: "/project/",
      trackId: "patchProject" // need to overwtrite with id
    },
    post: {
      api: "CONTENT",
      method: "POST",
      url: "/project",
      trackId: "postProject"
      // need to overwrite and add body
    },
    delete: {
      api: "CONTENT",
      method: "DELETE",
      url: "/project/",
      trackId: "deleteProject" // need to overwrite with id
    }
  },
  users: {
    get: {
      api: "CONTENT",
      method: "GET",
      url: "/user",
      trackId: "getUsers"
    },
    getSingle: {
      api: "CONTENT",
      method: "GET_SINGLE",
      url: "/user/",
      trackId: "getUser"
    },
    patch: {
      api: "CONTENT",
      method: "PATCH",
      url: "/user/",
      trackId: "patchUser" // need to overwtrite with id
    },
    post: {
      api: "CONTENT",
      method: "POST",
      url: "/user",
      trackId: "postUser"
      // need to overwrite and add body
    },
    delete: {
      api: "CONTENT",
      method: "DELETE",
      url: "/user/",
      trackId: "deleteUser" // need to overwrite with id
    }
  }
}