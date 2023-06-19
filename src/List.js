import { ButtonGroup, Container } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import * as Icon from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import { useNavigate, Navigate } from "react-router-dom";


import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from './firebase-auth/firebase';
import { useState, useEffect } from 'react';
import './Bulletin.css';

function NewlineText(props) {
    const text = props.text;
    const newText = text.split('\n').map(str => <p>{str}</p>);

    return newText;
}

function EditWindows(props) {
    //const docRef = doc(db, "announcement", props.docId);
    //const docSnap = getDocs(docRef);
    //console.log("Document data:", docSnap.data());
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    編輯公告({props.doc.id})
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>【{props.doc.category}】{props.doc.title}</h4>
                <p>
                    <NewlineText text={props.doc.content} />
                    {props.doc.pic ? <p><img src={props.doc.pic} alt="pic" width="300" /><br /></p> : <p></p>}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Update</Button>
            </Modal.Footer>
        </Modal>
    );
}



function DeleteWindows(props) {
    var docId = props.doc.id;
    
    const del = async () => {
        await deleteDoc(doc(db, 'announcement', docId));
        window.location.reload();
    }
    
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    刪除公告({props.doc.id})
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    確定要刪除? 此動作無法復原!
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={del}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    );

}



function List() {

    const [announcement, setAnnouncement] = useState([]);
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [document, setDoc] = useState("");

    const fetchPost = async () => {
        //db.collection('cities').order('population', 'desc')
        await getDocs(query(collection(db, "announcement"), orderBy('ptime', 'desc')))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));

                setAnnouncement(newData);
            })

    }

    useEffect(() => {
        fetchPost();
    }, [])

    

    return (
        <Container fluid className='mt-5'>
            <h1 className='text-center'>公告清單</h1>
            <Row className='justify-content-center'>
                <Col md={7}>
                    <Accordion defaultActiveKey="0">
                        <div className="announcement-list" >
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Edit / Delete</th>
                                        <th>Category</th>
                                        <th>Title</th>
                                        <th>Post Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        announcement?.map((item, i) => (

                                            <tr>
                                                <td>

                                                    <ButtonGroup className="me-2" aria-label="1"><Button variant="outline-primary" onClick={() => { setEditModalShow(true); setDoc(item) }}><Icon.PencilSquare /></Button></ButtonGroup>
                                                    <ButtonGroup className="me-2" aria-label="2"><Button variant="outline-danger" onClick={() => { setDeleteModalShow(true); setDoc(item)}}><Icon.Trash /></Button></ButtonGroup>
                                                </td>
                                                <td>{item.category}</td>
                                                <td>{item.title}</td>
                                                <td>{item.ptime}</td>

                                            </tr>



                                        ))
                                    }
                                </tbody>
                            </Table>


                        </div>
                    </Accordion>
                </Col>
            </Row>
            <EditWindows
                show={editModalShow}
                onHide={() => setEditModalShow(false)}
                doc={document}
            />
            <DeleteWindows
                show={deleteModalShow}
                onHide={() => setDeleteModalShow(false)}
                doc={document}
            />

        </Container>

    );
}

export default List;