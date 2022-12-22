import Head from 'next/head';
import Nav from '../components/Nav';
import PostCard from '../components/PostCard';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';

import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2



export default function Home({ posts,post }) {
    const [message, setMessage] = useState('');
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));
     // Delete post
     const deletePost = async (postId) => {
        //change deleting state
        setDeleting(true);

        try {
            // Delete post
            await fetch('/api/posts', {
                method: 'DELETE',
                body: postId,
            });

            // reset the deleting state
            setDeleting(false);
            // reload the page
            return router.push(router.asPath);
        } catch (error) {
            // stop deleting state
            return setDeleting(false);
        }
        
    };
    return (
        <div>
            <Head>
                <title>Home</title>
            </Head>
            <Nav />
            <div>
                <Typography variant='h4' component='h4' textAlign='center' mt={5} >Students Cards</Typography>
            </div>
            <div>
                <h3>{message}</h3>
            </div>
            {posts.length === 0 ? (
                <h2>No added posts</h2>
            ) : (
                <ul>
                    <Grid container spacing={1} columns={{ xs: 2, sm: 6, md: 12 }} >
                        {posts.map((post, i) => (

                            // <PostCard post={post} key={i} />
                            <Grid xs={2} sm={2} md={4} key={i}>

                                <Card sx={{ minWidth: 400, marginBottom: 3, marginRight: 5, background: '#5C2E7E', color: 'white',borderRadius: 7 }} key={i}>

                                    <CardContent>
                                        <Typography sx={{ fontSize: 14 }} color="text.light" gutterBottom>
                                            Student Details
                                        </Typography>
                                        <Typography variant="h5" component="div">
                                            Student Name: {post.stname}
                                        </Typography>
                                        <Typography sx={{ mb: 1.5 }} color="text.light">
                                            Student Grade: {post.stclass}
                                        </Typography>
                                        <Typography variant="body2">
                                            {post.stserial}
                                            <br />
                                            {post.createdAt}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small">Learn More</Button>
                                        <Button type="button" onClick={() => deletePost(post['_id'])}>
                                            {deleting ? 'Deleting' : 'Delete'}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </ul>
            )}
            <div>
            </div>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    // get the current environment
    let dev = process.env.NODE_ENV !== 'production';
    let { DEV_URL, PROD_URL } = process.env;

    // request posts from api
    let response = await fetch(`${dev ? DEV_URL : PROD_URL}/api/posts`);
    // extract the data
    let data = await response.json();

    return {
        props: {
            posts: data['message'],
        },
    };
}