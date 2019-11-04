import { REQUEST_TYPES } from './reducer';

export const requests = {
  requests: {
    get: {
      api: 'CONTENT',
      method: 'GET',
      url: '/request',
      trackId: 'getRequests'
    },
    post: {
      api: 'CONTENT',
      method: 'POST',
      url: '/request',
      trackId: 'postRequest'
    },
    patch: {
      api: 'CONTENT',
      method: 'PATCH',
      url: '/request',
      trackId: 'patchRequest'
    }
  },
  search: {
    post: {
      api: 'CONTENT',
      method: 'POST',
      url: '/search',
      trackId: 'postSearch'
    }
  },
  folders: {
    get: {
      api: 'CONTENT',
      method: 'GET',
      url: '/folder',
      trackId: 'getFolders'
    },
    patch: {
      api: 'CONTENT',
      method: 'PATCH',
      url: '/folder/',
      trackId: 'patchFolder' // need to overwtrite with id
    },
    post: {
      api: 'CONTENT',
      method: 'POST',
      url: '/folder',
      trackId: 'postFolder'
      // need to overwrite and add body
    },
    delete: {
      api: 'CONTENT',
      method: 'DELETE',
      url: '/folder/',
      trackId: 'deleteFolder' // need to overwrite with id
    }
  },
  tags: {
    get: {
      api: 'CONTENT',
      method: 'GET',
      url: '/tag/',
      trackId: 'getTags'
    },
    patch: {
      api: 'CONTENT',
      method: 'PATCH',
      url: '/tag/',
      trackId: 'patchTag' // need to overwtrite with id
    },
    post: {
      api: 'CONTENT',
      method: 'POST',
      url: '/tag/',
      trackId: 'postTag'
      // need to overwrite and add body
    },
    delete: {
      api: 'CONTENT',
      method: 'DELETE',
      url: '/tag/',
      trackId: 'deleteTag' // need to overwrite with id
    }
  },
  comments: {
    post: {
      api: 'CONTENT',
      method: 'PATCH',
      url: '/comment/', // need to add tagId
      trackId: 'postComment'
    },
    patch: {
      api: 'CONTENT',
      method: 'PATCH',
      url: '/comment/', // need to add tagId and commenId
      trackId: 'patchComment'
    },
    delete: {
      api: 'CONTENT',
      method: 'PATCH',
      url: '/comment/delete/', // need to add tagId and commentId
      trackId: 'deleteComment'
    }
  },
  projects: {
    get: {
      api: 'CONTENT',
      method: 'GET',
      url: '/project',
      trackId: 'getProjects'
    },
    getMany: {
      api: 'CONTENT',
      method: 'GET_MANY',
      url: '/projects/',
      trackId: 'getManyProjects'
    },
    getSingle: {
      api: 'CONTENT',
      method: 'GET_SINGLE',
      url: '/project/',
      trackId: 'getSingleProject'
    },
    patch: {
      api: 'CONTENT',
      method: 'PATCH',
      url: '/project/',
      trackId: 'patchProject' // need to overwtrite with id
    },
    post: {
      api: 'CONTENT',
      method: 'POST',
      url: '/project',
      trackId: 'postProject'
      // need to overwrite and add body
    },
    delete: {
      api: 'CONTENT',
      method: 'DELETE',
      url: '/project/',
      trackId: 'deleteProject' // need to overwrite with id
    }
  },
  users: {
    get: {
      api: 'CONTENT',
      method: 'GET',
      url: '/user',
      trackId: 'getUsers'
    },
    getSingle: {
      api: 'CONTENT',
      method: 'GET_SINGLE',
      url: '/user/',
      trackId: 'getUser'
    },
    patch: {
      api: 'CONTENT',
      method: 'PATCH',
      url: '/user/',
      trackId: 'patchUser' // need to overwtrite with id
    },
    post: {
      api: 'CONTENT',
      method: 'POST',
      url: '/user',
      trackId: 'postUser'
      // need to overwrite and add body
    },
    delete: {
      api: 'CONTENT',
      method: 'DELETE',
      url: '/user/',
      trackId: 'deleteUser' // need to overwrite with id
    }
  }
};
