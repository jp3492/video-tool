import React, { useCallback, useEffect, useState, memo } from 'react'
import { quantumReducer, quantumState } from '@piloteers/react-state'
import { REDUCERS } from '../../state/stores'
import { requests as allRequests } from '../../state/requests'
import { getRequestStatus } from "../../auth-package"
import { Link } from '@reach/router'

const requests = allRequests.search

const searchOptions = [
  {
    icon: "public",
    option: "global"
  },
  {
    icon: "people",
    option: "user"
  },
  {
    icon: "video_library",
    option: "project"
  },
  {
    icon: "folder",
    option: "folder"
  },
  {
    icon: "subscriptions",
    option: "tag"
  }
]

export const SearchBar = memo(() => {
  const { state: { data: searchResult }, actions: { ACTION }, dispatch } = quantumReducer({ id: REDUCERS.SEARCH })
  const { statuses }: any = getRequestStatus({ requests: allRequests.search })
  const [search, setSearch] = quantumState({ id: "SEARCH", initialValue: "" })
  const [options, setOption] = useState({ global: false, user: false, project: true, folder: false, tag: false })
  const [searchOpen, setSearchOpen] = useState(false)

  const postSearch = useCallback(() => {
    setSearchOpen(true)
    ACTION({
      ...requests.post,
      body: {
        search: search.toLowerCase(),
        options
      }
    })
  }, [search, options])

  const closeSearch = () => setSearchOpen(false)

  const requestConnection = () => { }
  const requestAccess = () => { }
  // const getSearchSuggestion = useCallback(() => {

  // }, [search, options])
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (search !== "") {
  //       console.log("Call suggestion request");
  //     }
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, [search])

  return (
    <div className="header-searchbar">
      <div>
        {
          searchOptions.map(({
            icon,
            option
          }, i) => (
              <i
                key={i}
                onClick={() => setOption({ ...options, [option]: !options[option] })}
                data-icon-active={options[option]}
                className="material-icons">
                {icon}
              </i>
            ))

        }
      </div>
      <input
        onFocus={() => setSearchOpen(true)}
        placeholder="Search..."
        type="text"
        value={search}
        onChange={({ target: { value } }) => setSearch(value)} />
      <div
        onClick={postSearch}
        className="header-searchbar-submit">
        <i className="material-icons">
          search
        </i>
        <label>
          Search
        </label>
      </div>
      <div className="header-searchbar-result">
        {
          searchOpen ?
            statuses.postSearch === "IDLE" ?
              null :
              statuses.postSearch === "LOADING" ?
                <ul>
                  <li>Loading...</li>
                </ul> :
                Object.keys(searchResult).length > 0 ?
                  <ul className="searchbar-result">
                    {
                      Object.keys(searchResult).map((type, i) => {
                        switch (type) {
                          case "user": return <Users users={searchResult[type]} requestConnection={requestConnection} />
                          case "project": return <Projects projects={searchResult[type]} requestAccess={requestAccess} />
                        }
                      })
                    }
                    <li className="searchbar-close">
                      <div onClick={closeSearch}>
                        <i className="material-icons">
                          clear
                      </i>
                      </div>
                    </li>
                  </ul> :
                  <ul>
                    <li>Nothing found...</li>
                  </ul> :
            null
        }
      </div>
    </div>
  )
})

const Projects = ({
  projects,
  requestAccess
}) => {
  const [selectedProjects, setSelectedProjects]: any = useState([])

  const handleSelectProject = _id => setSelectedProjects(selectedProjects.includes(_id) ? selectedProjects.filter(i => i !== _id) : [...selectedProjects, _id])

  return (
    <li>
      <h4>
        Projects:
      </h4>
      <ul>
        {
          projects.map(({
            label,
            _id
          }, i) => (
              <li
                className="searchbar-result__project"
                key={i}>
                <i
                  onClick={() => handleSelectProject(_id)}
                  className="material-icons">
                  {
                    selectedProjects.includes(_id) ?
                      "check_box" :
                      "check_box_outline_blank"
                  }
                </i>
                <label>
                  {label}
                </label>
                <div>
                  <Link to={`/player?ids=${JSON.stringify([_id])}`}>
                    <i className="material-icons">
                      open_in_new
                    </i>
                  </Link>
                </div>
              </li>
            ))
        }
        {
          selectedProjects.length > 0 &&
          <li className="searchbar-result__project-selection">
            <label>
              {`${selectedProjects.length} Project${selectedProjects.length === 1 ? "" : "s"} selected`}
            </label>
            <Link to={`/player?ids=${JSON.stringify(selectedProjects)}`}>
              <label>
                Open in Player
                  </label>
              <i className="material-icons">
                play_arrow
                  </i>
            </Link>
          </li>
        }
      </ul>
    </li>

  )
}

const Users = ({
  users,
  requestConnection
}) => {

  return (
    <li>
      <h4>
        Users:
      </h4>
      <ul>
        {
          users.map(({
            email,
            information: {
              firstName,
              lastName
            }
          }, i) => (
              <li key={i}>
                <label>
                  {email}
                </label>
                <div>
                  <i className="material-icons">
                    person_add
                    </i>
                </div>
              </li>
            ))
        }
      </ul>
    </li>

  )
}