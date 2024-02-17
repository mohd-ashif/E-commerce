import React, { useContext, useReducer, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MeassageBox'; 
import { Store } from '../Store';
import axios from 'axios';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, users: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ProductListScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
 
  const [{ loading, error, users }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    users: []
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `http://localhost:5000/users`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` }
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    if (userInfo) {
      fetchData();
    }
  }, [userInfo]);

  return (
    <div className="container-fluid">
      <Helmet>
        <title>users List</title>
      </Helmet>
      <h1>users List</h1>
     
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="table-responsive ">
            <table  className="table table-striped table-bordered table-hover">
              <thead cals>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>IsAdmin</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => ( 
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? 'Yes' : 'No'}</td>

                    
                    
                    
                    
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      )}
    </div>
  );
}
