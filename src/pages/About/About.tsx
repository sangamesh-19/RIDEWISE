import { Row, Col } from "antd";
import image1 from '../../assets/image 1.jpg'
import image2 from '../../assets/image 2.jpg';
import image3 from '../../assets/image 3.jpg';
import image4 from '../../assets/image 4.jpg';
import './About.css';


const About: React.FC = () => {
    return (
        <>
            <div className="about-container">
                <h1>About RideWise</h1>
                <p>
                    RideWise is a cab booking platform that allows users to search and compare cabs from Uber, Ola, and Rapido in one go.
                </p>
                <p>
                    The platform is designed to help users find the best ride every time by providing a comprehensive list of available cabs and their prices.
                </p>
                <p>
                    RideWise aims to simplify the cab booking process by offering a user-friendly interface and a seamless booking experience.
                </p>
            </div>
            <div className="cab-user">
                <h1>Are you a regular Cab user?</h1>
                <Row gutter={[30, 26]} className="row">
                    <Col className="col" xs={24} md={12} sm={24} lg={12} xl={12}>
                        <img src={image1} alt="Cab 1" height={300} width={500} />
                        <p>Book your next cab at the cheapest price. Save up to 50% on long-distance & airport rides.</p>
                        <br />
                        <img src={image2} alt="Cab 2" height={300} width={500} />
                        <p>Find more ride hail options that you didn't know existed.</p>
                    </Col>
                    <Col className="col" xs={24} md={12} sm={24} lg={12} xl={12}>
                        <img src={image3} alt="Cab 3" height={300} width={500} />
                        <p>Just one app to find the best ride across cab services. Reduce the app clutter on your mobile.</p>
                        <br />
                        <img src={image4} alt="Cab 4" height={300} width={500} />
                        <p>Compare cab prices to save time and money on every ride, up to Rs 5000 every month!</p>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default About;
