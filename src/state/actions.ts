import { PLAYER_STATES } from './../pages/player/states'
import { REDUCERS } from './stores'
import { ACTION, REDUCER, REQUEST_TYPES } from './reducer'
import { requests } from './requests'
import { dispatchToStores, setQuantumValue, getStateById, getQuantumValue } from '@piloteers/react-state'
import { MODAL, MODAL_TYPES } from '../components/modal/modal'

const USER_ACTION = options => ACTION(options)(action => dispatchToStores({ ids: [REDUCERS.USERS], action }))
const FOLDER_ACTION = options => ACTION(options)(action => dispatchToStores({ ids: [REDUCERS.FOLDERS], action }))
const PROJECT_ACTION = options => ACTION(options)(action => dispatchToStores({ ids: [REDUCERS.PROJECTS], action }))
const TAG_ACTION = options => ACTION(options)(action => dispatchToStores({ ids: [REDUCERS.TAGS], action }))
const REQUEST_ACTION = options => ACTION(options)(action => dispatchToStores({ ids: [REDUCERS.REQUESTS], action }))
const SEARCH_ACTION = options => ACTION(options)(action => dispatchToStores({ ids: [REDUCERS.SEARCH], action }))

const openModal = modal => setQuantumValue(MODAL, modal)
const closeModal = () => setQuantumValue(MODAL, {})
const getItems = id => getStateById(id).data

// USER
export const getUser = async userId => {
  const user = await USER_ACTION({
    ...requests.users.getSingle,
    url: requests.users.getSingle.url + userId
  })
  setQuantumValue("ME", user)
  return user
}
export const getUsers = async () =>
  await USER_ACTION(requests.users.get)
export const postUser = async (email: string, cognitoId: string) =>
  await USER_ACTION({ ...requests.users.post, body: { email, cognitoId } })

// FOLDER
export const getFolders = async () =>
  await FOLDER_ACTION(requests.folders.get)
export const postFolder = async body =>
  await FOLDER_ACTION({ ...requests.folders.post, body })
export const patchFolder = async ({ _id, ...body }) =>
  await FOLDER_ACTION({ ...requests.folders.patch, url: requests.folders.patch.url + _id, body })
export const deleteFolder = async _id =>
  await FOLDER_ACTION({ ...requests.folders.delete, url: requests.folders.patch.url + _id })

// PROJECT
export const getProjects = async () =>
  await PROJECT_ACTION(requests.projects.get)
export const postProject = async body =>
  await PROJECT_ACTION({ ...requests.projects.post, body })
export const patchProject = async ({ _id, ...body }) =>
  await PROJECT_ACTION({ ...requests.projects.patch, url: requests.projects.patch.url + _id, body })
export const deleteProject = async _id =>
  await FOLDER_ACTION({ ...requests.projects.delete, url: requests.projects.patch.url + _id })

// SEARCH
const targets = (option, search) => {
  switch (option) {
    case "user": return getStateById(REDUCERS.USERS).data.filter(({ email }) => email.toLowerCase().includes(search))
    case "project": return getStateById(REDUCERS.PROJECTS).data.filter(({ label }) => label.toLowerCase().includes(search))
    case "folder": return getStateById(REDUCERS.FOLDERS).data.filter(({ label }) => label.toLowerCase().includes(search))
    case "tag": return getStateById(REDUCERS.TAGS).data.filter(({ text }) => text.toLowerCase().includes(search))
    default:
      break;
  }
}
const getLocalSearchResult = (search: string, options: any) => {
  const activeOptions: string[] = Object.keys(options).reduce((res: any, o) => options[o] ? [...res, o] : res, [])
  let result = {}
  for (let index = 0; index < activeOptions.length; index++) {
    const optionResult = targets(activeOptions[index], search)
    if (optionResult.length !== 0) {
      result = {
        ...result,
        [activeOptions[index]]: optionResult
      }
    }
  }
  return result
}
export const postSearch = async (options, search) => {
  if (options.global) {
    SEARCH_ACTION({
      ...requests.search.post,
      body: {
        search: search.toLowerCase(),
        options
      }
    })
  } else {
    TAG_ACTION(requests.tags.get).then(() => {
      const data = getLocalSearchResult(search.toLowerCase(), options)
      dispatchToStores({ ids: [REDUCERS.SEARCH], action: { type: REQUEST_TYPES.GET, data } })
    })
  }
}

// REQUEST
export const getRequests = async () =>
  await REQUEST_ACTION(requests.requests.get)

// TAG
export const getTags = async projectIds =>
  await TAG_ACTION({ ...requests.tags.get, url: requests.tags.get.url + projectIds })
export const postTag = async (projectId, tag) => {
  try {
    const newTag = await TAG_ACTION({ ...requests.tags.post, url: requests.tags.post.url + projectId, body: tag })
    addTagToProject(projectId, newTag._id)
    return newTag
  } catch (error) {
    console.error(error)
  }
}
export const patchTag = async tag =>
  await TAG_ACTION({ ...requests.tags.patch, url: requests.tags.post.url + tag._id, body: tag })

export const removeTagsFromProject = async tagIds => {
  const projectId = JSON.parse(getQuantumValue(PLAYER_STATES.PROJECT_ID))[0]
  const thisProject = getItems(REDUCERS.PROJECTS).find(p => p._id === projectId)
  return await patchProject({
    ...thisProject,
    tags: thisProject.tags.filter(tag => !tagIds.map(({ _id }) => _id).includes(tag))
  })
}

export const addTagToProject = (projectId, tagId) => dispatchToStores({
  ids: [REDUCERS.PROJECTS],
  action: {
    type: REQUEST_TYPES.ADD_TAG_TO_PROJECT,
    data: {
      projectId,
      tagId
    }
  }
})
export const addTagsToProjects = async (projectIds, tagIds) => {
  const projects = getItems(REDUCERS.PROJECTS)
  for (let index = 0; index < projectIds.length; index++) {
    const id = projectIds[index];
    const project = projects.find(p => p._id === id)
    const updatedProject = {
      ...project,
      tags: [
        ...project.tags,
        ...tagIds
      ]
    }
    await patchProject(updatedProject)
  }
  closeModal()
}
// MODAL
export const folderModal = (initialValues?: any) => openModal({
  title: initialValues ? "Edit Folder" : "New Folder",
  name: MODAL_TYPES.FOLDER_FORM,
  props: {
    folders: getItems(REDUCERS.FOLDERS),
    selectedFolderId: getQuantumValue("SELECTED_FOLDER_ID"),
    action: folder => initialValues ?
      patchFolder(folder).then(closeModal) :
      postFolder(folder).then(closeModal),
    initialValues
  }
})
export const projectModal = (initialValues?: any) => openModal({
  title: initialValues ? "Edit Project" : "New Project",
  name: MODAL_TYPES.PROJECT_FORM,
  props: {
    // selectedFolderId: "adssada",
    folders: getItems(REDUCERS.FOLDERS),
    selectedFolderId: getQuantumValue("SELECTED_FOLDER_ID"),
    action: project => initialValues && initialValues.hasOwnProperty("_id") ?
      patchProject(project).then(closeModal) :
      postProject(project).then(closeModal),
    initialValues
  }
})
export const addTagsToProjectsModal = (links, tagIds) => openModal({
  title: "Add Tags to Projects",
  name: MODAL_TYPES.ATT_TO_PROJECT_FORM,
  props: {
    folders: getItems(REDUCERS.FOLDERS),
    projects: getItems(REDUCERS.PROJECTS),
    selectedFolderId: undefined,
    action: projectIds => addTagsToProjects(projectIds, tagIds),
    initialValues: {
      links
    }
  }
})