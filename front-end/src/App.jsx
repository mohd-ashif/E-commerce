import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from './Store';
import NavDropdown from 'react-bootstrap/NavDropdown';
import HomeScreen from './Screen/HomeScreen';
import ProductScreen from './Screen/ProductScreen';
import CartScreen from './Screen/CartScreen';
import SigninScreen from "./Screen/SigninScreen";
import SignupScreen from "./Screen/SignupScreen";
import PlaceOrderScreen from "./Screen/PlaceOrderScreen";
import OrderScreen from './Screen/OrderSreen';
import OrderHistoryScreen from './Screen/OrderHistoryScreen';
import ShippingScreen from "./Screen/ShippingScreen";
import PaymentMethodScreen from './Screen/PaymentMethodScreen';
import ProfileScreen from './Screen/ProfileScreen';
import { getError } from './utils';
import axios from 'axios';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <BrowserRouter>
        <div
          className={
            sidebarIsOpen
              ? 'd-flex flex-column site-container active-cont'
              : 'd-flex flex-column site-container'
          }
        >
          <ToastContainer position='bottom-center' limit={1} />
          <header>
            <Navbar bg='dark' variant='dark' expand='lg'>
              <Container>
                <Button
                  variant="dark"
                  onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
                >
                  <i className="fas fa-bars"></i>
                </Button>

                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                  <Nav className='me-auto w-100 justify-content-end'>
                    <LinkContainer to='/'>
                      <Navbar.Brand>amazona</Navbar.Brand>
                    </LinkContainer>
                    <Nav className='me-auto w-100 justify-content-end'>
                      <Link to='/cart' className='nav-link'>
                        Cart{' '}
                        {cart.cartItems.length > 0 && (
                          <Badge pill bg='danger'>
                            {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                          </Badge>
                        )}
                      </Link>
                      {userInfo ? (
                        <NavDropdown title={userInfo.name} id='basic-nav-dropdown'>
                          <LinkContainer to='/profile'>
                            <NavDropdown.Item>User Profile</NavDropdown.Item>
                          </LinkContainer>
                          <LinkContainer to='/orderhistory'>
                            <NavDropdown.Item>Order History</NavDropdown.Item>
                          </LinkContainer>
                          <NavDropdown.Divider />
                          <Link
                            className='dropdown-item'
                            to='#signout'
                            onClick={signoutHandler}
                          >
                            Sign Out
                          </Link>
                        </NavDropdown>
                      ) : (
                        <Link className='nav-link' to='/signin'>
                          Sign In
                        </Link>
                      )}
                      {userInfo && userInfo.isAdmin && (
                        <NavDropdown title='Admin' id='admin-nav-dropdown'>
                          <LinkContainer to='/admin/dashboard'>
                            <NavDropdown.Item>Dashboard</NavDropdown.Item>
                          </LinkContainer>
                          <LinkContainer to='/admin/products'>
                            <NavDropdown.Item>Products</NavDropdown.Item>
                          </LinkContainer>
                          <LinkContainer to='/admin/orders'>
                            <NavDropdown.Item>Orders</NavDropdown.Item>
                          </LinkContainer>
                          <LinkContainer to='/admin/users'>
                            <NavDropdown.Item>Users</NavDropdown.Item>
                          </LinkContainer>
                        </NavDropdown>
                      )}
                    </Nav>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </header>

          <div
            className={
              sidebarIsOpen
                ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
                : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
            }
          >
            <Nav className="flex-column text-white w-100 p-2">
              <Nav.Item>
                <strong>Categories</strong>
              </Nav.Item>
              {categories.map((category) => (
                <Nav.Item key={category}>
                  <Nav.Link
                    as={Link}
                    to={`/search?category=${category}`}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    {category}
                  </Nav.Link>

                </Nav.Item>
              ))}
            </Nav>
          </div>

          <main>
            <Container className='mt-3'>
              <Routes>
                <Route path="/product/:slug" element={<ProductScreen />} />
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/signin" element={<SigninScreen />} />
                <Route path="/signup" element={<SignupScreen />} />
                <Route path="/placeorder" element={<PlaceOrderScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/order/:id" element={<OrderScreen />} />
                <Route path="/orderhistory" element={<OrderHistoryScreen />} />
                <Route path="/shipping" element={<ShippingScreen />} />
                <Route path="/payment" element={<PaymentMethodScreen />} />
                <Route path="/" element={<HomeScreen />} />
              </Routes>
            </Container>
          </main>
          <footer>
            <div className='text-center'>all rights reserved</div>
          </footer>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
