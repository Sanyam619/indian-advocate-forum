// Admin Management Panel - Served by Next.js to avoid CORS issues
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import Head from 'next/head';
import Layout from '@/components/Layout';
import NewsVideoUploadForm from '@/components/news/NewsVideoUploadForm';
import prisma from '@/lib/prisma';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADVOCATE' | 'ADMIN';
  profilePicture?: string;
  createdAt: string;
}

interface News {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  videoUrl?: string;
  hasVideo: boolean;
  createdAt: string;
  author: {
    fullName: string;
    email: string;
    role: string;
  };
}

interface Podcast {
  id: string;
  title: string;
  description: string;
  category: string;
  videoUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
  uploadedBy: {
    fullName: string;
    email: string;
    role: string;
  };
}

interface Judge {
  id: string;
  name: string;
  designation: string;
  court: string;
  photoUrl?: string;
  appointmentDate?: string;
}

interface AdminPanelProps {
  adminUser: {
    email: string;
    fullName: string;
    role: string;
  };
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const session = await getSession(req, res);
    
    if (!session?.user) {
      return {
        redirect: {
          destination: '/auth',
          permanent: false,
        },
      };
    }

    // Skip database check if DATABASE_URL is not available (build time)
    if (!process.env.DATABASE_URL) {
      return {
        redirect: {
          destination: '/?error=server_error',
          permanent: false,
        },
      };
    }

    // Check if user exists in database and is an admin
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });

    if (!user || user.role !== 'ADMIN') {
      // Not an admin - redirect to access denied or home
      return {
        redirect: {
          destination: '/?error=access_denied',
          permanent: false,
        },
      };
    }

    return {
      props: {
        adminUser: {
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
    };
  } catch (error) {
    console.error('Error checking admin access:', error);
    // During build, return minimal props instead of redirecting
    return {
      props: {
        adminUser: {
          email: 'build@time.com',
          fullName: 'Build Time',
          role: 'USER',
        },
      },
    };
  }
};

export default function AdminPanel({ adminUser }: AdminPanelProps) {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [removeEmail, setRemoveEmail] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [loading, setLoading] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [showJudges, setShowJudges] = useState(false);
  const [showNewsList, setShowNewsList] = useState(false);
  const [showPodcastsList, setShowPodcastsList] = useState(false);
  const [showJudgesList, setShowJudgesList] = useState(false);

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const makeAdmin = async () => {
    if (!userEmail) {
      showMessage('Please enter an Email address', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/make-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail
        })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(`✅ SUCCESS! ${data.user.email} is now an ADMIN.`, 'success');
        setUserEmail('');
      } else {
        showMessage(`❌ ERROR: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Network error:', error);
      showMessage(`❌ NETWORK ERROR: Failed to connect to server`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const removeAdmin = async () => {
    if (!removeEmail) {
      showMessage('Please enter an Email address', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/remove-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: removeEmail
        })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(`✅ SUCCESS! ${data.user.email} is no longer an admin.`, 'success');
        setRemoveEmail('');
      } else {
        showMessage(`❌ ERROR: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Network error:', error);
      showMessage(`❌ NETWORK ERROR: Failed to connect to server`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const createNews = async (formData: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    imageUrl?: string;
    videoUrl?: string;
    videoThumbnail?: string;
    hasVideo: boolean;
  }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(`✅ News article "${formData.title}" created successfully!`, 'success');
        setShowNewsForm(false);
      } else {
        showMessage(`❌ ERROR: ${data.error || data.message}`, 'error');
      }
    } catch (error) {
      console.error('Network error:', error);
      showMessage(`❌ NETWORK ERROR: Failed to connect to server`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const listUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/list-users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data.allUsers);
        showMessage(`✅ Found ${data.totalUsers} users in database`, 'success');
      } else {
        showMessage(`❌ ERROR: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Network error:', error);
      showMessage(`❌ NETWORK ERROR: Failed to connect to server`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const listAllNews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/list-news', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setNews(data.allNews);
        setShowNewsList(true);
        showMessage(`✅ Found ${data.totalNews} news articles`, 'success');
      } else {
        showMessage(`❌ ERROR: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Network error:', error);
      showMessage(`❌ NETWORK ERROR: Failed to connect to server`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteNews = async (newsId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the news article "${title}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/delete-news', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newsId })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(`✅ News article deleted successfully`, 'success');
        // Refresh the news list
        listAllNews();
      } else {
        showMessage(`❌ ERROR: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Network error:', error);
      showMessage(`❌ NETWORK ERROR: Failed to connect to server`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const listAllPodcasts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/list-podcasts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setPodcasts(data.allPodcasts);
        setShowPodcastsList(true);
        showMessage(`✅ Found ${data.totalPodcasts} podcasts`, 'success');
      } else {
        showMessage(`❌ ERROR: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Network error:', error);
      showMessage(`❌ NETWORK ERROR: Failed to connect to server`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const deletePodcast = async (podcastId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the podcast "${title}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/delete-podcast', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ podcastId })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(`✅ Podcast deleted successfully`, 'success');
        // Refresh the podcasts list
        listAllPodcasts();
      } else {
        showMessage(`❌ ERROR: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Network error:', error);
      showMessage(`❌ NETWORK ERROR: Failed to connect to server`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const listAllJudges = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/list-judges', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setJudges(data.allJudges);
        setShowJudgesList(true);
        showMessage(`✅ Found ${data.totalJudges} judges`, 'success');
      } else {
        showMessage(`❌ ERROR: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Network error:', error);
      showMessage(`❌ NETWORK ERROR: Failed to connect to server`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteJudge = async (judgeId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete Judge ${name}?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/delete-judge', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ judgeId })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(`✅ Judge deleted successfully`, 'success');
        // Refresh the judges list
        listAllJudges();
      } else {
        showMessage(`❌ ERROR: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Network error:', error);
      showMessage(`❌ NETWORK ERROR: Failed to connect to server`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Admin Management Panel</title>
      </Head>

      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto',
        padding: '40px 20px',
      }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            color: '#1f2937', 
            fontSize: '32px', 
            marginBottom: '10px',
            fontWeight: 'bold',
          }}>
            🔐 Admin Management Panel
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '18px',
            maxWidth: '500px',
            margin: '10px auto',
            lineHeight: '1.6'
          }}>
            Logged in as: <strong>{adminUser.fullName}</strong> ({adminUser.email})
          </p>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '16px',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Manage administrator privileges and content for your Indian Advocate Forum
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div style={{
            padding: '16px',
            marginBottom: '24px',
            borderRadius: '8px',
            backgroundColor: messageType === 'success' ? '#d1fae5' : messageType === 'error' ? '#fee2e2' : '#dbeafe',
            border: `2px solid ${messageType === 'success' ? '#10b981' : messageType === 'error' ? '#ef4444' : '#3b82f6'}`,
            color: messageType === 'success' ? '#065f46' : messageType === 'error' ? '#dc2626' : '#1e40af',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            fontSize: '15px',
            fontWeight: '500'
          }}>
            {message}
          </div>
        )}

        {/* Make Admin Section */}
        <div style={{ 
          marginBottom: '30px', 
          padding: '24px', 
          backgroundColor: '#ffffff', 
          border: '1px solid #e5e7eb', 
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ 
            color: '#059669', 
            fontSize: '22px', 
            marginBottom: '16px',
            fontWeight: 'bold',
            paddingBottom: '8px'
          }}>✅ Make Someone an Admin</h2>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#374151' }}>
            Email Address:
          </label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="user@example.com"
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }}
          />
        </div>
          <button
            onClick={makeAdmin}
            disabled={loading}
            style={{
              backgroundColor: '#059669',
              color: 'white',
              padding: '14px 28px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s',
              transform: loading ? 'none' : 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = '#047857';
                target.style.transform = 'translateY(-1px)';
                target.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = '#059669';
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            Make Admin
          </button>
      </div>

      {/* Create News Section */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h2 style={{ color: '#7c3aed', fontSize: '20px', marginBottom: '15px' }}>📰 News Management</h2>
        <p style={{ color: '#6b7280', marginBottom: '15px' }}>
          Create, view, and delete news articles with optional video content
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowNewsForm(true)}
            disabled={loading}
            style={{
              backgroundColor: '#7c3aed',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            Create New Article
          </button>
          <button
            onClick={() => listAllNews()}
            disabled={loading}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            View All News
          </button>
        </div>

        {/* News List */}
        {showNewsList && news.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#374151', marginBottom: '15px', fontSize: '18px' }}>All News Articles ({news.length} total):</h3>
            <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
              {news.map((item, index) => (
                <div key={item.id} style={{
                  padding: '15px',
                  borderBottom: index < news.length - 1 ? '1px solid #e5e7eb' : 'none',
                  backgroundColor: '#f9fafb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: '#374151', fontSize: '16px' }}>{item.title}</strong>
                    <br />
                    <span style={{ color: '#6b7280', fontSize: '13px' }}>
                      Category: {item.category} | By: {item.author.fullName} | {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    {item.hasVideo && (
                      <span style={{ 
                        marginLeft: '10px',
                        padding: '2px 8px',
                        backgroundColor: '#ddd6fe',
                        color: '#7c3aed',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}>
                        VIDEO
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteNews(item.id, item.title)}
                    disabled={loading}
                    style={{
                      backgroundColor: '#dc2626',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.6 : 1,
                      fontWeight: '600'
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Judge Management Section */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '25px', 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)', 
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          color: '#059669', 
          fontSize: '24px', 
          fontWeight: '700',
          marginBottom: '8px',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>⚖️ Judge Management</h2>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '16px', 
          marginBottom: '25px',
          lineHeight: '1.5'
        }}>Add, view, and delete judges with JSON data and Cloudinary photo URLs</p>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push(`/admin/add-judge`)}
            style={{
              backgroundColor: '#059669',
              color: 'white',
              padding: '14px 28px',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = '#047857';
              target.style.transform = 'translateY(-2px)';
              target.style.boxShadow = '0 6px 20px rgba(5, 150, 105, 0.4)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = '#059669';
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = '0 4px 15px rgba(5, 150, 105, 0.3)';
            }}
          >
            Add New Judge
          </button>

          <button
            onClick={() => listAllJudges()}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '14px 28px',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = '#1d4ed8';
              target.style.transform = 'translateY(-2px)';
              target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = '#2563eb';
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
            }}
          >
            View All Judges
          </button>
        </div>

        {/* Judges List */}
        {showJudgesList && judges.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#374151', marginBottom: '15px', fontSize: '18px' }}>All Judges ({judges.length} total):</h3>
            <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
              {judges.map((judge, index) => (
                <div key={judge.id} style={{
                  padding: '15px',
                  borderBottom: index < judges.length - 1 ? '1px solid #e5e7eb' : 'none',
                  backgroundColor: '#f9fafb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: '#374151', fontSize: '16px' }}>{judge.name}</strong>
                    <br />
                    <span style={{ color: '#6b7280', fontSize: '13px' }}>
                      {judge.designation} | {judge.court}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteJudge(judge.id, judge.name)}
                    disabled={loading}
                    style={{
                      backgroundColor: '#dc2626',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.6 : 1,
                      fontWeight: '600'
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Podcast Management Section */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '25px', 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)', 
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          color: '#7c3aed', 
          fontSize: '24px', 
          fontWeight: '700',
          marginBottom: '8px',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>🎙️ Podcast Management</h2>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '16px', 
          marginBottom: '25px',
          lineHeight: '1.5'
        }}>Upload, view, and delete podcast episodes with Cloudinary integration</p>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push(`/admin/upload-podcast`)}
            style={{
              backgroundColor: '#7c3aed',
              color: 'white',
              padding: '14px 28px',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = '#6d28d9';
              target.style.transform = 'translateY(-2px)';
              target.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.4)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = '#7c3aed';
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = '0 4px 15px rgba(124, 58, 237, 0.3)';
            }}
          >
            Add New Podcast
          </button>

          <button
            onClick={() => listAllPodcasts()}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '14px 28px',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = '#1d4ed8';
              target.style.transform = 'translateY(-2px)';
              target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = '#2563eb';
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
            }}
          >
            View All Podcasts
          </button>
        </div>

        {/* Podcasts List */}
        {showPodcastsList && podcasts.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#374151', marginBottom: '15px', fontSize: '18px' }}>All Podcasts ({podcasts.length} total):</h3>
            <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
              {podcasts.map((podcast, index) => (
                <div key={podcast.id} style={{
                  padding: '15px',
                  borderBottom: index < podcasts.length - 1 ? '1px solid #e5e7eb' : 'none',
                  backgroundColor: '#f9fafb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: '#374151', fontSize: '16px' }}>{podcast.title}</strong>
                    <br />
                    <span style={{ color: '#6b7280', fontSize: '13px' }}>
                      Category: {podcast.category} | By: {podcast.uploadedBy.fullName} | {new Date(podcast.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => deletePodcast(podcast.id, podcast.title)}
                    disabled={loading}
                    style={{
                      backgroundColor: '#dc2626',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.6 : 1,
                      fontWeight: '600'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Remove Admin Section */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h2 style={{ color: '#dc2626', fontSize: '20px', marginBottom: '15px' }}>❌ Remove Admin Privileges</h2>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#374151' }}>
            Email Address:
          </label>
          <input
            type="email"
            value={removeEmail}
            onChange={(e) => setRemoveEmail(e.target.value)}
            placeholder="admin@example.com"
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }}
          />
        </div>
        <button
          onClick={removeAdmin}
          disabled={loading}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '14px 28px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s',
            transform: loading ? 'none' : 'translateY(0)',
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = '#b91c1c';
              target.style.transform = 'translateY(-1px)';
              target.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.15)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = '#dc2626';
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }
          }}
        >
          {loading ? 'Processing...' : 'Remove Admin'}
        </button>
      </div>

      {/* List Users Section */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h2 style={{ color: '#2563eb', fontSize: '20px', marginBottom: '15px' }}>👥 List All Users</h2>
        <button
          onClick={listUsers}
          disabled={loading}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '14px 28px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            marginBottom: '20px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s',
            transform: loading ? 'none' : 'translateY(0)',
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = '#1d4ed8';
              target.style.transform = 'translateY(-1px)';
              target.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.15)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = '#2563eb';
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }
          }}
        >
          {loading ? 'Loading...' : 'Get All Users'}
        </button>

        {users.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#374151', marginBottom: '15px' }}>Users in Database ({users.length} total):</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
              {users.map((user, index) => (
                <div key={user.id} style={{
                  padding: '15px',
                  borderBottom: index < users.length - 1 ? '1px solid #e5e7eb' : 'none',
                  backgroundColor: user.role === 'ADMIN' ? '#fef3c7' : user.role === 'ADVOCATE' ? '#ddd6fe' : '#f3f4f6'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: '#374151' }}>{user.fullName}</strong>
                      <br />
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>{user.email}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: user.role === 'ADMIN' ? '#fbbf24' : user.role === 'ADVOCATE' ? '#8b5cf6' : '#6b7280',
                        color: 'white'
                      }}>
                        {user.role}
                      </span>
                      <br />
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{ padding: '20px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', color: '#0c4a6e' }}>
        <h3 style={{ marginBottom: '15px' }}>Instructions:</h3>
        <ol style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
          <li><strong>Access Control:</strong> Only users with ADMIN role in the database can access this panel</li>
          <li>To make someone an admin: Enter their email and click <strong>"Make Admin"</strong> (requires master key in API)</li>
          <li>To remove admin privileges: Enter their email and click <strong>"Remove Admin"</strong></li>
          <li>To create news articles: Click <strong>"Create New Article"</strong> and fill out the form</li>
          <li>To add judges: Click <strong>"Add New Judge"</strong> and paste JSON data with Cloudinary photo URL</li>
          <li>To add podcasts: Go to <strong>Podcast Management</strong> section and click <strong>"Add New Podcast"</strong></li>
          <li>To see all users: Click <strong>"Get All Users"</strong></li>
          <li>All operations are authenticated through your Auth0 session and database role</li>
        </ol>
        <p style={{ marginTop: '15px', fontSize: '14px' }}>
          <strong>Note:</strong> This panel only works when your website is running. Make sure your Next.js server is active.
        </p>
      </div>

      {/* News Creation Modal */}
      {showNewsForm && (
        <NewsVideoUploadForm
          onSubmit={createNews}
          onCancel={() => setShowNewsForm(false)}
          isSubmitting={loading}
        />
      )}
      </div>
    </Layout>
  );
}