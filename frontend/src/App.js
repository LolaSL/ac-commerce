import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeBannerPage from './pages/HomeBannerPage';
import ProductPage from './pages/ProductPage.jsx';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store.js';
import CartPage from './pages/CartPage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import ShippingAddressPage from './pages/ShippingAddressPage.jsx';
import SignupPage from './pages/SignUp.jsx'
import PaymentMethodPage from './pages/PaymentMethodPage.jsx';
import PlaceOrderPage from './pages/PlaceOrderPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import Button from 'react-bootstrap/Button';
import { getError } from './utils.js';
import axios from 'axios';
import SearchBox from './components/SearchBox.jsx';
import SearchPage from './pages/SearchPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.js';
import DashboardPage from './pages/DashboardPage.jsx';
import AdminRoute from './components/AdminRoute.js';
import ProductListPage from './pages/ProductListPage.jsx';
import ProductEditPage from './pages/ProductEditPage.jsx';
import OrderListPage from './pages/OrderListPage.jsx';
import UserListPage from './pages/UserListPage.jsx';
import UserEditPage from './pages/UserEditPage.jsx';
import MapPage from './pages/MapPage.jsx';
import ForgetPasswordPage from './pages/ForgetPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import SellerPage from './pages/SellerPage.jsx';
import SellersPage from './pages/SellersPage.jsx';
import FeaturedPage from './pages/FeaturedPage.jsx';
import SellerEditPage from './pages/SellerEditPage.jsx';
import SellersListPage from './pages/SellersListPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import Footer from './components/Footer.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Measurement from './pages/Measurement.jsx';
import ServiceProviderLogin from './pages/ServiceProviderLogin.jsx';
import ServiceProviderRegister from './pages/ServiceProviderRegister.jsx';
import ServiceProviderProfile from './pages/ServiceProviderProfile.jsx';
import HoursPage from './pages/HoursPage.jsx';
import EarningsPage from './pages/EarningsPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import BlogsList from './pages/BlogsList.jsx';
import BlogDetails from './pages/BlogDetails.jsx';
import BlogEditPage from './pages/BlogEditPage.jsx';
import BlogsPage from './pages/Blogspage.jsx';
import MessagesPage from './pages/MessagesPage.jsx';
import ServiceProviderList from './pages/ServiceProviderList.jsx'
import Users from './components/UsersProductSales.jsx';
import ServiceProviders from './components/ServiceProviders';
import Notifications from './components/Notifications.jsx';
import Offers from './pages/Offers.jsx';
import AdvancedAC from './pages/AdvancedAC.jsx';
import MessageEditPage from './pages/MessageEditPage.jsx';
import SeviceProviderEditPage from './pages/SeviceProviderEditPage.jsx'


function App() {

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, cart, userInfo, serviceProviderInfo } = state;

  const checkoutHandler = (e) => {
    e.preventDefault();
    window.location.href = ("/signin?redirect=/uploadfile");
  };
  const checkoutOffersHandler = (e) => {
    e.preventDefault();
    window.location.href = ("/signin?redirect=/offers");
  };
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('serviceProviderInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/';
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <BrowserRouter>

      <div
        className={
          sidebarIsOpen
            ? fullBox
              ? 'site-container active-cont d-flex flex-column full-box'
              : 'site-container active-cont d-flex flex-column'
            : fullBox
              ? 'site-container d-flex flex-column full-box'
              : 'site-container d-flex flex-column'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header >
          <Navbar className="navbar" bg="secondary" variant="secondary" expand="lg">
            <Container>
              <Button
                variant="secondary"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)} className="btn me-4"
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand><h3>
                  <span>AC</span> Commerce
                </h3>
                  <p className="handwritten">
                    Cooling Solutions For Every Space
                  </p></Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto  w-100  justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                  {serviceProviderInfo ? (
                    <NavDropdown title={serviceProviderInfo.name} id="provider-nav-dropdown">
                      <LinkContainer to="/serviceprovider/profile/:id">
                        <NavDropdown.Item>Service Provider Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/serviceprovider/projects">
                        <NavDropdown.Item>Projects</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/serviceprovider/hours">
                        <NavDropdown.Item>Hours</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/serviceprovider/earnings">
                        <NavDropdown.Item>Earnings</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/serviceprovider/messages">
                        <NavDropdown.Item>Messages</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Log Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/serviceprovider/login">
                      Service Provider Login
                    </Link>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/manage-service-providers">
                        <NavDropdown.Item>Service Providers</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/sellers">
                        <NavDropdown.Item>Sellers</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/blogs-list">
                        <NavDropdown.Item>Blogs</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column bg-secondary'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column bg-secondary'
          }
        >
          <Nav className="flex-column text-white w-100 p-4" >
            <Nav.Item className='search-title me-auto'>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={{ pathname: '/search', search: `category=${category}` }} 
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link className='px-1'>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
            <Nav.Item className='search-title me-auto'>
              <Link to="/uploadfile" onClick={checkoutHandler} className="links fw-bold">Get A Quote</Link>
            </Nav.Item>
            <Nav.Item className='search-title me-auto'>
              <Link to="/offers" onClick={checkoutOffersHandler} className="links fw-bold">Offers</Link>
            </Nav.Item>
            <Nav.Item className='search-title me-auto'>
              <Link to="/sellers" className="links fw-bold">Explore Suppliers</Link>
            </Nav.Item>
            <Nav.Item className='search-title me-auto'>
              <Link to="/blogs" className="links fw-bold">Blogs</Link>
            </Nav.Item>
            <Nav.Item className='search-title me-auto'>
              <Link to="/contact" className="links fw-bold">Contact</Link>
            </Nav.Item>    <Nav.Item className='search-title me-auto'>
              <Link to="/about-us" className="links fw-bold">About Us</Link>
            </Nav.Item>
          </Nav>
        </div>
        <main>
          <Container fluid className="no-padding">
            <Routes>
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/products" element={<FeaturedPage />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/serviceprovider/login" element={<ServiceProviderLogin />} />
              <Route path="/serviceprovider/register" element={<ServiceProviderRegister />} />
              <Route
                path="/forget-password"
                element={<ForgetPasswordPage />}
              />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordPage />}
              />
              <Route
                path="/serviceprovider/profile/:id"
                element={
                  <ProtectedRoute>
                    <ServiceProviderProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/serviceprovider/earnings"
                element={
                  <ProtectedRoute>
                    <EarningsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/serviceprovider/hours"
                element={
                  <ProtectedRoute>
                    <HoursPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/serviceprovider/projects"
                element={
                  <ProtectedRoute>
                    <ProjectsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/serviceprovider/messages"
                element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderPage />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderPage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryPage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/shipping"
                element={<ShippingAddressPage />}
              ></Route>
              <Route path="/payment" element={<PaymentMethodPage />}></Route>
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardPage />
                  </AdminRoute>
                }
              ></Route>
                  <Route
                path="/admin/message/:id/edit" 
                element={
                  <AdminRoute>
                    <MessageEditPage/>
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/dashboard/users"
                element={
                  <AdminRoute>
                    <Users />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/dashboard/service-providers"
                element={
                  <AdminRoute>
                    <ServiceProviders />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/dashboard/notification"
                element={
                  <AdminRoute>
                    <Notifications />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/sellers"
                element={
                  <AdminRoute>
                    <SellersListPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/manage-service-providers"
                element={
                  <AdminRoute>
                    <ServiceProviderList />
                  </AdminRoute>
                }
              ></Route>
                   <Route
                path="/admin/manage-service-providers/:id"
                element={
                  <AdminRoute>
                    <SeviceProviderEditPage/>
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/blogs-list"
                element={
                  <AdminRoute>
                    <BlogsPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/sellers/:id"
                element={
                  <AdminRoute>
                    <SellerEditPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/blog/:id"
                element={
                  <AdminRoute>
                    <BlogEditPage />
                  </AdminRoute>
                }
              ></Route>
              <Route path="/sellers" element={<SellersPage />} />
              <Route path="/sellers/:id" element={<SellerPage />} />
              <Route path="/sellers/edit/:id" element={<SellerEditPage />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/uploadfile" element={<Measurement />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blogs" element={<BlogsList />} />
              <Route path="/advanced-ac" element={<AdvancedAC />} />
              <Route path="/blogs/:id" element={<BlogDetails />} />
              <Route path="/blogs-list" element={<BlogsPage />} />
              <Route path="/" element={<HomeBannerPage />} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
