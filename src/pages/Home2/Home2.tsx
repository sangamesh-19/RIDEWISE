import Navbar from "../../components/Navbar/Navbar";
import Location_det from "../../components/Location_det/Location_det";
import cabimg from "../../assets/cab-compare.jpg";
import "../Home2/Home2.css";
import { Col, Row } from "antd";


const App = () => {
  return (
    <>

        <Navbar></Navbar>
        <Row gutter={16}>
          <Col xs={24} md={24} sm={24} lg={12} xl={12}>
              <Location_det />
          </Col>
          <Col xs={24} md={24} sm={24} lg={12} xl={12}>
          <img src={cabimg} alt="" className="cabim" />
          </Col>
        </Row>
    </>
  );
};

export default App;