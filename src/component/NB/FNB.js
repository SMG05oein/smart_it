import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
// Using Ionicons 5 for a modern mobile app look
import { 
    IoHomeOutline, IoHome,
    IoMapOutline, IoMap,
    IoChatbubblesOutline, IoChatbubbles,
    IoGridOutline, IoGrid
} from "react-icons/io5";

const Fnb = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Helper to determine active state
    const isActive = (path) => location.pathname === path;

    // Brand color
    const activeColor = "#4dabf7";
    const inactiveColor = "#adb5bd";

    // Nav Item Component to reduce repetition
    const NavItem = ({ path, icon: Icon, activeIcon: ActiveIcon, label }) => {
        const active = isActive(path);
        return (
            <Col
                xs={3}
                className="d-flex flex-column justify-content-center align-items-center"
                onClick={() => navigate(path)}
                style={{ cursor: 'pointer', height: '100%' }}
            >
                <div style={{ 
                    fontSize: '1.5rem', 
                    color: active ? activeColor : inactiveColor,
                    marginBottom: '2px',
                    transition: 'all 0.2s'
                }}>
                    {active ? <ActiveIcon /> : <Icon />}
                </div>
                <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: active ? '600' : '400',
                    color: active ? activeColor : inactiveColor 
                }}>
                    {label}
                </span>
            </Col>
        );
    };

    return (
        <div 
            className="fixed-bottom bg-white" 
            style={{ 
                height: '70px', 
                borderTopLeftRadius: '20px', 
                borderTopRightRadius: '20px',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
                zIndex: 1000,
                paddingBottom: 'env(safe-area-inset-bottom)' // iPhone X+ safe area
            }}
        >
            <Container fluid className="h-100">
                <Row className="h-100">
                    <NavItem 
                        path="/hospital" 
                        icon={IoMapOutline} 
                        activeIcon={IoMap} 
                        label="병원찾기" 
                    />
                    
                    <NavItem 
                        path="/chat" 
                        icon={IoChatbubblesOutline} 
                        activeIcon={IoChatbubbles} 
                        label="AI상담" 
                    />

                    <NavItem 
                        path="/" 
                        icon={IoHomeOutline} 
                        activeIcon={IoHome} 
                        label="홈" 
                    />

                    <NavItem 
                        path="/board" 
                        icon={IoGridOutline} 
                        activeIcon={IoGrid} 
                        label="커뮤니티" 
                    />
                </Row>
            </Container>
        </div>
    );
};

export default Fnb;