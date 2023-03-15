import React, { Fragment, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { ToastContainer,toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'


const Todos = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isActive, setIsActive] = useState(0);

  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [isEditActive, setIsEditActive] = useState(0);



  const handleEdit = (id) => {
    handleShow();
    axios.get(`http://localhost:5264/api/Employee/${id}`)
    .then((result) => {
        setEditName(result.data.name);
        setEditAge(result.data.age);
        setIsEditActive(result.data.isActive);
        setEditId(result.data.id);
    }).catch((error) => {
        console.log(error);
    })
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete the Employee?") === true) {
      axios.delete(`http://localhost:5264/api/Employee/${id}`)
      .then((result) => {
        if(result.status === 200){
            toast.success("User has been deleted");
            getDate();
        }
      }).catch((error) => {
        console.log(error);
    })
    }
  };
  const handleUpdate = () => {
    const BaseURL = `http://localhost:5264/api/Employee/${editId}`;
    const data = {
        "id": editId,
        "name": editName,
        "age": editAge,
        "isActive": isEditActive
    }
    axios.put(BaseURL,data)
    .then((result) => {
        getDate();
        clear();
        handleClose();
        toast.success('Employee has been Updated');
    }).catch((error) => {
        console.log(error);
    })
  };

  const handleIsActive = (e) =>{
    if(e.target.checked)
    {
        setIsActive(1)
    }
    else{
        setIsActive(0);
    }
  }
  const handleIsEditActive = (e) =>{
    if(e.target.checked)
    {
        setIsEditActive(1)
    }
    else{
        setIsEditActive(0);
    }
  }

  const handleSave = () => {
    const BaseURL = `http://localhost:5264/api/Employee`;
    const data = {
        "name": name,
        "age": age,
        "isActive": isActive
    }
    axios.post(BaseURL,data)
    .then((result) => {
        getDate();
        clear();
        toast.success('Employee has been added');
    }).catch((error) => {
        console.log(error);
    })
  }
  const clear = () => {
    setName ('');
    setAge('');
    setIsActive(0);
    setEditName ('');
    setEditAge('');
    setIsEditActive (0);
    setEditId('');
  }
  useEffect(() => {
    getDate();
  }, []);

  const getDate = () => {
    axios.get(`http://localhost:5264/api/Employee`)
        .then((result) => {
            setData(result.data);
        })
        .catch((error) => {
            toast.error(error);
        })
  }
  return (
    <Fragment>
        <ToastContainer/>
      <Container>
        <Row>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </Col>
          <Col>
            <input
              type="checkbox"
              checked={isActive === 1 ? true : false}
              value={isActive}
              onChange={(e) => handleIsActive(e)}
            />
            <label>IsActive</label>
          </Col>
          <Col>
            <button className="btn btn-primary" onClick={() => handleSave()} >Submit</button>
          </Col>
        </Row>
      </Container>
      <br />
      {data && data.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Index</th>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>IsActive</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((task, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{task.id}</td>
                  <td>{task.name}</td>
                  <td>{task.age}</td>
                  <td>{task.isActive}</td>
                  <td colSpan={2}>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEdit(task.id)}
                    >
                      Edit
                    </button>{" "}
                    &nbsp;
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <h1>Loading...</h1>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Employee </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Age"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="checkbox"
                checked={isEditActive === 1 ? true : false}
                onChange={(e) => handleIsEditActive(e)}
                value={isEditActive}
              />
              <label>IsActive</label>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default Todos;
