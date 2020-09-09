import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../actions/actions";
import * as helper from "../helper/commands";

const Yml = () => {

  const [filepath, setFilepath] = useState("");
  const [fileList, setfileList] = useState("");

  const dispatch = useDispatch();
  const composeymlFiles = (data) => dispatch(actions.composeymlFiles(data));
  const networkList = useSelector((state) => state.lists.networkList);

  useEffect(() => {
    console.log("hi im here");
    let holder = document.getElementById("drag-file");
    holder.ondragover = () => {
      return false;
    };
    holder.ondragleave = () => {
      return false;
    };
    holder.ondragend = () => {
      return false;
    };
    holder.ondrop = (e) => {
      e.preventDefault();
      let fileList = e.dataTransfer.files;
      console.log(fileList); 
      if (fileList.length > 1) return;
      if (fileList[0].type === "application/x-yaml") {
        const filteredArr = fileList[0].path.split("/");
        filteredArr.pop();
        let filteredPath = filteredArr.join("/");
        setFilepath(filteredPath);
        setfileList(fileList[0].name);
      }
      return false;
    };
  }, []);

  /**
   * networkList is array from the redux store
   * Only display relationship of containers when networkList's length is more than 1
   * networkList file format looks like in this format below
   * 
   * [{
   *  "a": [
   *        {"cid": "1", "name": "conatiner1"}, 
   *        {"cid": "2", "name": "container2"}
   *      ]
   * }, 
   * {
   *  "b": [
   *        {"cid": "3", "name": "container3"}, 
   *        {"cid": "4", "name": "container4"}
   *       ]
   * }]
   */
  const NetworkDisplay = () => {
    if (networkList.length) {
      let newArray = [];
      
      //First iteration of network List
      for (let i = 0; i < networkList.length; i++) {
        let keys = Object.keys(networkList[i]); // save keys in this format ["parentName"]
        //newArray.push(keys[0])
        let parent = keys[0];
        newArray.push(<span>Parent: {parent}</span>);
        
        for (let j = 0; j < networkList[i][keys[0]].length; j++) {
          let parents = networkList[i][keys[0]][j];
          console.log("parents: ", parents)

          for (let k = 0; k < parents.length; k++) {
            let container = networkList[i][keys[0]][j][k];
            newArray.push(
              <div>
                <span>ID: {container["cid"]}</span>
                <span>Name: {container["name"]}</span>
              </div>
            );
          }
        }
      }
      console.log("newArray: ", newArray);
      return <div>{newArray}</div>;
    } else {
      return <></>
    }

  };

  return (
    <div className="renderContainers">
      <div className="jumbotron">
        <h1>Drop your file below box</h1>
        <p className="alert alert-info" id="drag-file">
          file name: {fileList}
          file path: {filepath}
        </p>
      </div>

      <br />
      <button
        id="btn"
        className="btn btn-success"
        onClick={() => helper.connectContainers(filepath, composeymlFiles)}
      >
        Run Yml Files
      </button>
      <NetworkDisplay />
    </div>
  );
};

export default Yml;
