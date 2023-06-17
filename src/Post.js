import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { signOut } from "firebase/auth";
import { auth } from "./firebase-auth/firebase";
import { useNavigate, Navigate } from "react-router-dom";
import { useContext } from "react";
import { useState } from "react";
import AuthContext from "./firebase-auth/AuthContext";
import { collection, doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from './firebase-auth/firebase';
import dayjs from 'dayjs';
import Alert from 'react-bootstrap/Alert';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";



function Post() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("銷售");
    const [picture, setPicture] = useState("");
    const [error, seterror] = useState("");
    const [success, setSuccess] = useState(false);
    const { user } = useContext(AuthContext);
    const [file, setFile] = useState("");
    const [percent, setPercent] = useState(0);
    const [date, setDate] = useState("");

    if (!user) {
        return <Navigate replace to="/login" />;
    }

    const handleLogout = async () => {
        await signOut(auth);
    };

    function handleChange(event) {
        setFile(event.target.files[0]);
    }


    const handleSubmit = async (e) => {

        const storageRef = ref(storage, `/bulletin_image/${file.name}`);

        e.preventDefault();
        var today = new Date();
        var date = dayjs(today).format('YYYYMMDDHHmmss');
        setDate(date);
        var datePost = dayjs(today).format('YYYY/MM/DD HH:mm:ss');

        // progress can be paused and resumed. It also exposes progress updates.
        // Receives the storage reference and the file to upload.
        const uploadTask = uploadBytesResumable(storageRef, file);

        if(file){
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
    
                    // update progress
                    setPercent(percent);
                },
                (err) => console.log(err),
                () => {
                    try{
    
                    } catch(e) { seterror(e); }
                    // download url
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        console.log(url);
                        setPicture(url);
                        console.log(picture);
    
                        const docRef = setDoc(doc(db, "announcement", date.toString()), {
                            ptime: datePost,
                            title: title,
                            content: content,
                            category: category,
                            pic:url,
                        });
                        
                        setSuccess(true);
                        
                    });
                    
                }
            );
        }else{
            try{
                const docRef = setDoc(doc(db, "announcement", date.toString()), {
                    ptime: datePost,
                    title: title,
                    content: content,
                    category: category,
                    pic:"",
                });
                
                setSuccess(true);
            }catch(e){ seterror(e); }
        }
        
    }

    return (

        <Container fluid className='mt-5'>

            <section>
                <Row className='justify-content-center'>
                    <Col lg='8'>
                        <Row className='mb-4'>
                            <Col>
                                <h1>公告發布</h1>
                            </Col>
                            <Col>
                                <div class="d-flex flex-row-reverse">
                                    <Button onClick={handleLogout}>Logout</Button>
                                </div>

                            </Col>
                        </Row>

                        <hr className="my-4" />
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>標題</Form.Label>
                                <Form.Control required type="text" placeholder="請輸入公告標題" value={title} onChange={(e) => setTitle(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>內文</Form.Label>
                                <Form.Control required as="textarea" placeholder="請輸入公告內文" rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>分類</Form.Label>
                                <Form.Select required aria-label="Default select example" value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option Value="銷售">銷售</option>
                                    <option value="宣傳">宣傳</option>
                                    <option value="新品">新品</option>
                                    <option value="其他">其他</option>
                                    <option value="測試">測試</option>
                                </Form.Select>
                            </Form.Group>
                            <br />
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>圖片附件</Form.Label>
                                <Row>
                                    <Col><Form.Control type="file" onChange={handleChange} accept="image/*" /></Col>
                                </Row>
                                     
                            </Form.Group>
                            <hr className="my-4" />
                            
                            
                            
                            <Button variant="primary" type="submit">送出</Button>

                            {error ? <Alert variant='danger'>Something worng, please try again. ({error})</Alert> : <p></p>}
                            {success ? <Alert variant='success'>Success!</Alert> : <p></p>}
                            {percent ? <Alert variant='info'>File Upload: {percent} % done</Alert> : <p></p>}
                            

                        </Form>
                    </Col>
                </Row>
            </section>
        </Container>
    );
}

export default Post;
