import React, { useCallback, useEffect, useState, memo, useMemo } from "react";
import {
  quantumReducer,
  quantumState,
  getStateById
} from "@piloteers/react-state";
import { REDUCERS } from "../../state/stores";
import { requests as allRequests } from "../../state/requests";
import { getRequestStatus, RequestStatusEnum } from "../../auth-package";
import { Link } from "@reach/router";
import { postSearch, postRequest } from "../../state/actions";

const requests = allRequests.search;

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
];

export const SearchBar = memo(() => {
  const {
    state: { data: searchResult }
  } = quantumReducer({ id: REDUCERS.SEARCH });
  const {
    state: { data: folders }
  } = quantumReducer({ id: REDUCERS.FOLDERS });
  const { statuses }: any = getRequestStatus({ requests: allRequests.search });
  const [search, setSearch] = quantumState({ id: "SEARCH", initialValue: "" });
  const [options, setOption] = useState({
    global: false,
    user: false,
    project: false,
    folder: false,
    tag: false
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = quantumState({
    id: "SELECTED_FOLDER",
    returnValue: false
  });

  const handlePostSearch = useCallback(() => postSearch(options, search), [
    search,
    options
  ]);

  const closeSearch = () => setSearchOpen(false);

  const requestAccess = () => {};
  const handleOpenFolder = id => {
    setSearchOpen(false);
    setSelectedFolder(id);
  };

  return (
    <div className="header-searchbar">
      <div>
        {searchOptions.map(({ icon, option }, i) => (
          <i
            key={i}
            onClick={() =>
              setOption({ ...options, [option]: !options[option] })
            }
            data-icon-active={options[option]}
            className="material-icons"
          >
            {icon}
          </i>
        ))}
      </div>
      <input
        onFocus={() => setSearchOpen(true)}
        placeholder="Search everywhere..."
        type="text"
        value={search}
        onChange={({ target: { value } }) => setSearch(value)}
      />
      <div onClick={handlePostSearch} className="header-searchbar-submit">
        <i className="material-icons">search</i>
        {/* <label>
          Search
        </label> */}
      </div>
      <div className="header-searchbar-result">
        {searchOpen ? (
          statuses.postSearch === "IDLE" &&
          options.global ? null : statuses.postSearch === "LOADING" &&
            options.global ? (
            <ul>
              <li>Loading...</li>
            </ul>
          ) : Object.keys(searchResult).length > 0 ? (
            <ul className="searchbar-result">
              {Object.keys(searchResult).map((type, i) => {
                switch (type) {
                  case "user":
                    return <Users users={searchResult[type]} />;
                  case "project":
                    return (
                      <Projects
                        projects={searchResult[type]}
                        requestAccess={requestAccess}
                        folders={folders}
                      />
                    );
                  case "folder":
                    return (
                      <Folders
                        folders={searchResult[type]}
                        openFolder={handleOpenFolder}
                      />
                    );
                  case "tag":
                    return <Tags tags={searchResult[type]} folders={folders} />;
                }
              })}
              <li className="searchbar-close">
                <div onClick={closeSearch}>
                  <i className="material-icons">clear</i>
                </div>
              </li>
            </ul>
          ) : (
            <ul>
              <li>Nothing found...</li>
              <li className="searchbar-close">
                <div onClick={closeSearch}>
                  <i className="material-icons">clear</i>
                </div>
              </li>
            </ul>
          )
        ) : null}
      </div>
    </div>
  );
});

const Tags = ({ tags, folders }) => {
  const [previewTag, setPreviewTag] = quantumState({ id: "PREVIEW" });
  const [selectedTags, setSelectedTags]: any = useState([]);

  const handleSelectTag = useCallback(
    id =>
      selectedTags.includes(id)
        ? setSelectedTags(selectedTags.filter(t => t !== id))
        : setSelectedTags([...selectedTags, id]),
    [selectedTags]
  );

  const selectedTagLinks = useMemo(
    () =>
      selectedTags.reduce((res, t) => {
        const thisTag = tags.find(tag => tag._id === t);
        if (res.includes(thisTag.url)) {
          return res;
        } else {
          return [...res, thisTag.url];
        }
      }, []),
    [tags, selectedTags]
  );

  return (
    <li className="searchbar-result__tags">
      <h4>Tags:</h4>
      <ul>
        {tags.map((tag, i) => (
          <li key={i}>
            <i
              onClick={() => handleSelectTag(tag._id)}
              className="material-icons"
            >
              {selectedTags.includes(tag._id)
                ? "check_box"
                : "check_box_outline_blank"}
            </i>
            <label>{tag.text}</label>
            <label>{tag.videoName}</label>
            <i onClick={() => setPreviewTag(tag)} className="material-icons">
              ondemand_video
            </i>
          </li>
        ))}
        {selectedTags.length > 0 && (
          <li className="searchbar-result__tag-selection">
            <label>
              {`${selectedTags.length} Tags${
                selectedTags.length === 1 ? "" : "s"
              } selected`}
            </label>
            <div>
              {/* <label>
                Save as
                  </label> */}
              <i className="material-icons">save</i>
            </div>
            <div>
              {/* <label>
                Open in Player
                  </label> */}
              <i className="material-icons">play_arrow</i>
            </div>
          </li>
        )}
      </ul>
    </li>
  );
};

const Folders = ({ folders, openFolder }) => {
  return (
    <li>
      <h4>Folders:</h4>
      <ul>
        {folders.map(({ label, _id }, i) => (
          <li key={i}>
            <label>{label}</label>
            <i onClick={() => openFolder(_id)} className="material-icons">
              folder_open
            </i>
          </li>
        ))}
      </ul>
    </li>
  );
};

const Projects = ({ projects, requestAccess, folders }) => {
  const [selectedProjects, setSelectedProjects]: any = useState([]);

  const handleSelectProject = _id =>
    setSelectedProjects(
      selectedProjects.includes(_id)
        ? selectedProjects.filter(i => i !== _id)
        : [...selectedProjects, _id]
    );

  return (
    <li>
      <h4>Projects:</h4>
      <ul>
        {projects.map(({ label, _id }, i) => (
          <li className="searchbar-result__project" key={i}>
            <i
              onClick={() => handleSelectProject(_id)}
              className="material-icons"
            >
              {selectedProjects.includes(_id)
                ? "check_box"
                : "check_box_outline_blank"}
            </i>
            <label>{label}</label>
            <div>
              <Link to={`/player?ids=${JSON.stringify([_id])}`}>
                <i className="material-icons">open_in_new</i>
              </Link>
            </div>
          </li>
        ))}
        {selectedProjects.length > 0 && (
          <li className="searchbar-result__project-selection">
            <label>
              {`${selectedProjects.length} Project${
                selectedProjects.length === 1 ? "" : "s"
              } selected`}
            </label>
            <div>
              {/* <label>
                Save as
                  </label> */}
              <i className="material-icons">save</i>
            </div>
            <Link to={`/player?ids=${JSON.stringify(selectedProjects)}`}>
              {/* <label>
                Open in Player
                  </label> */}
              <i className="material-icons">play_arrow</i>
            </Link>
          </li>
        )}
      </ul>
    </li>
  );
};

const Users = ({ users }) => {
  const [me] = quantumState({ id: "ME" });
  const {
    state: { data: requests }
  } = quantumReducer({ id: REDUCERS.REQUESTS });
  console.log(me);

  const getStatus = useCallback(
    _id => {
      const request = requests.find(r => r.from === _id || r.to === _id);
      console.log(request);

      if (!request) {
        return "IDLE";
      } else if (request.status === "PENDING" && request.from === me._id) {
        return "SENT";
      } else if (request.status === "PENDING") {
        return "RECEIVED";
      } else if (request.status === "ACCEPTED") {
        return "ACCEPTED";
      } else if (request.status === "REJECTED") {
        return "REJECTED";
      }
    },
    [requests]
  );

  return (
    <li>
      <h4>Users:</h4>
      <ul>
        {users.map((user, i) => (
          <User key={i} requestStatus={getStatus(user._id)} {...user} />
        ))}
      </ul>
    </li>
  );
};

const User = memo(({ requestStatus, ...user }: any) => {
  const { isLoading, trackStatus } = getRequestStatus({});

  const trackId = useMemo(() => `postRequest-${user._id}`, [user._id]);
  const loading = isLoading(trackId);

  useMemo(() => {
    trackStatus(trackId);
  }, [user._id]);

  const requestConnection = () =>
    postRequest({
      to: user._id,
      target: user._id,
      type: "user"
    });

  // mögliche statuses:
  // request, loading, pending, failedToSend, accept, reject
  return (
    <li>
      <label>{user.email}</label>
      <div>
        <i onClick={requestConnection} className="material-icons">
          {loading
            ? "sync"
            : requestStatus === "IDLE"
            ? "person_add"
            : requestStatus === "SENT"
            ? "clear"
            : requestStatus === "ACCEPTED"
            ? "how_to_reg"
            : requestStatus === "RECEIVED"
            ? "done"
            : "report"}
        </i>
      </div>
    </li>
  );
});
