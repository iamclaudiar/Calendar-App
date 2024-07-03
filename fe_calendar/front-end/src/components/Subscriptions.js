import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from './Menu';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const api = "http://localhost:8080";

const SubscriptionForm = () => {
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [username, setUserName] = useState(null);
    const [role, setRole] = useState(null);
    const [memberId, setMemberId] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserName(decodedToken.name);
            setMemberId(decodedToken.id);
            setRole(decodedToken.role);
        } else {
            navigate("/home");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchSubscription = async () => {
            const token = localStorage.getItem('token');
            if (token && memberId) {
                try {
                    const response = await axios.get(api + `/api/subscriptions/member/${memberId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setSubscription(response.data);
                } catch (error) {
                    console.error('Failed to get subscription', error);
                    alert('Failed to get subscription');
                }
            }
        };

        fetchSubscription();
    }, [memberId]);

    const handleSubscriptionSelection = (days, subscriptionType) => {
        setSelectedSubscription({ days, subscriptionType });
    };

    const handleSubscriptionRequest = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const { days, subscriptionType } = selectedSubscription;

            try {
                const response = await axios.post(api + '/api/subscriptions', {
                    memberId,
                    days,
                    subscriptionType
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                console.log('Subscription created successfully', response.data);
                alert('Subscription created successfully');
            } catch (error) {
                console.error('Failed to create subscription', error);
                alert('Failed to create subscription');
            }
        }
    };

    const getMember = async (memberId) => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(api + `/api/members/${memberId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          return response.data.name;
        } catch (error) {
          console.error('Error fetching member:', error);
          return '';
        }
      };  

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const token = localStorage.getItem('token');
                const decodedToken = jwtDecode(token);
                setRole(decodedToken.role);
                if (role === "GYMMANAGEMENT") {
                const response = await axios.get(api + `/api/subscriptions/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                      }
                });
                const subscriptions = response.data;

                const memberNamesPromises = subscriptions.map(async (sub) => {
                    const memberName = await getMember(sub.memberId);
                    return { ...sub, memberName };
                });

                const subscriptionsWithMemberNames = await Promise.all(memberNamesPromises);
                setSubscriptions(subscriptionsWithMemberNames);
            }
            } catch (error) {
                console.error('Failed to fetch subscriptions', error);
            }
        };

        fetchSubscriptions();
    }, [role]);

    return (
        <div>
            <Menu username={username} />
            <h2>Subscriptions:</h2>
            <div>
                <ul>
                    <li>Basic - 1 day</li>
                    <li>Basic - 30 days</li>
                    <li>Basic - 1 year</li>
                    <li>VIP - 1 day</li>
                    <li>VIP - 30 days</li>
                    <li>VIP - 1 year</li>
                </ul>
            </div>
            {role === 'MEMBER' && (
                <div>
                    <button onClick={() => handleSubscriptionSelection(1, 'basic')}>1 Day Basic</button>
                    <button onClick={() => handleSubscriptionSelection(30, 'basic')}>30 Days Basic</button>
                    <button onClick={() => handleSubscriptionSelection(365, 'basic')}>1 Year Basic</button>
                    <br />
                    <button onClick={() => handleSubscriptionSelection(1, 'vip')}>1 Day VIP</button>
                    <button onClick={() => handleSubscriptionSelection(30, 'vip')}>30 Days VIP</button>
                    <button onClick={() => handleSubscriptionSelection(365, 'vip')}>1 Year VIP</button>
                    <br />
                    <button onClick={handleSubscriptionRequest}>Buy</button>
                </div>
            )}
            {role === 'MEMBER' && ( subscription ? (
                <div>
                    <h2>Subscription details</h2>
                    <p><strong>Expiration date:</strong> {new Date(subscription.expirationDate).toLocaleString()}</p>
                    <p><strong>Subscription type:</strong> {subscription.subscriptionType}</p>
                </div>
            ) : (
                <p>No subscription found</p>
            ))}

        {role === 'GYMMANAGEMENT' && (
            <div>
            <h2>All Subscriptions</h2>
            <ul>
                {subscriptions.map(subscription => (
                    <li key={subscription.id}>
                        <strong>Member name: </strong>{subscription.memberName}
                        <br/>
                        <strong>Subscription type: </strong>{subscription.subscriptionType}
                        <br/>
                        <strong>Created date: </strong>{new Date(subscription.createdDate).toLocaleString()}
                        <br/>
                        <strong>Expiration date: </strong>{new Date(subscription.expirationDate).toLocaleString()}
                        <br/><br/>
                    </li>
                ))}
            </ul>
            </div>
        )}
        </div>
    );
};

export default SubscriptionForm;
