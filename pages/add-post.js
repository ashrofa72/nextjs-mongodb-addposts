import { useState } from 'react';
import Button from '@mui/material/Button';
import Nav from '../components/Nav';
import styles from '../styles/Home.module.css';
import { Typography } from '@mui/material';


export default function AddPost() {
    const [stname, setstName] = useState('');
    const [stclass, setstClass] = useState('');
    const [stserial, setstSerial] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const stclasses=['Select Class',1,2,3,4,5,6,7]

    const handlePost = async (e) => {
        e.preventDefault();

        // reset error and message
        setError('');
        setMessage('');

        // fields check
        if (!stname || !stclass || !stserial) return setError('All fields are required');

        // post structure
        let post = {
            stname,
            stclass,
            stserial,
            published: false,
            createdAt: new Date().toISOString(),
        };
        // save the post
        let response = await fetch('/api/posts', {
            method: 'POST',
            body: JSON.stringify(post),
        });

        // get the data
        let data = await response.json();

        if (data.success) {
            // reset the fields
            setstName('');
            setstClass('');
            setstSerial('');
            // set the message
            return setMessage(data.message);
        } else {
            // set the error
            return setError(data.message);
        }
    };

    return (
        <div>
            <Nav />
            <div className={styles.container}>
                <Typography variant='h4' fontFamily='Oxygen' >Add New Student</Typography>
                <form onSubmit={handlePost} className={styles.form}>
                    {error ? (
                        <div className={styles.formItem}>
                            <h3 className={styles.error}>{error}</h3>
                        </div>
                    ) : null}
                    {message ? (
                        <div className={styles.formItem}>
                            <h3 className={styles.message}>{message}</h3>
                        </div>
                    ) : null}
                    <div className={styles.formItem}>
                        <label>Name</label>
                        <input
                            type="text"
                            name="title"
                            onChange={(e) => setstName(e.target.value)}
                            value={stname}
                            placeholder="Name"
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label>Student Class</label>
                        <select className={styles.Select} onChange={(e) => setstClass(e.target.value)} placeholder="student class">
                            {stclasses.map(stclass => (
                                <option className={styles.Option} key={stclass}>{stclass}</option>
                            ))}
                            
                        </select>
                        
                        <div className={styles.formItem}>
                            <label>Device Serial</label>
                            <input
                                type='text'
                                name="stserial"
                                onChange={(e) => setstSerial(e.target.value)}
                                value={stserial}
                                placeholder="Device Serial"
                            />
                        </div>
                    </div>
                    <div className={styles.formItem}>
                        <Button type="submit" variant="contained">Add Student</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}