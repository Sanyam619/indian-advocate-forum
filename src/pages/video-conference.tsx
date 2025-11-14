import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '../components/Layout'
import { 
  ScaleIcon,
  VideoCameraIcon,
  ClockIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  PlusIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  ComputerDesktopIcon,
  LinkIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline'

export default function VideoConference() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('live')
  const [meetingCode, setMeetingCode] = useState('')
  const [isAdmin, setIsAdmin] = useState(true) // Demo: assuming user is admin

  const liveMeetings = [
    {
      id: 1,
      title: 'Supreme Court Constitutional Bench Hearing',
      host: 'Chief Justice D.Y. Chandrachud',
      participants: 156,
      startTime: '2024-03-15T10:30:00',
      status: 'live',
      isPublic: true,
      meetingId: 'SC-CONST-001'
    },
    {
      id: 2,
      title: 'Delhi High Court - Environmental Law Discussion',
      host: 'Justice Prathiba M. Singh',
      participants: 45,
      startTime: '2024-03-15T14:00:00',
      status: 'live',
      isPublic: true,
      meetingId: 'DHC-ENV-002'
    }
  ]

  const upcomingMeetings = [
    {
      id: 3,
      title: 'Legal Aid Workshop - Rural Areas',
      host: 'Advocate Priya Sharma',
      scheduledTime: '2024-03-16T11:00:00',
      expectedParticipants: 200,
      isPublic: true,
      meetingId: 'LA-RURAL-003'
    },
    {
      id: 4,
      title: 'Criminal Law Updates Seminar',
      host: 'Justice B.R. Gavai',
      scheduledTime: '2024-03-17T15:30:00',
      expectedParticipants: 300,
      isPublic: true,
      meetingId: 'CL-SEM-004'
    },
    {
      id: 5,
      title: 'Corporate Law - Mergers & Acquisitions',
      host: 'Advocate Rajesh Kumar',
      scheduledTime: '2024-03-18T10:00:00',
      expectedParticipants: 75,
      isPublic: false,
      meetingId: 'CL-MA-005'
    }
  ]

  const recentMeetings = [
    {
      id: 6,
      title: 'Family Law Reform Discussion',
      host: 'Justice Hima Kohli',
      completedTime: '2024-03-14T16:00:00',
      participants: 89,
      duration: '2h 15m',
      recording: true,
      meetingId: 'FL-REF-006'
    },
    {
      id: 7,
      title: 'Cyber Crime Prevention Workshop',
      host: 'Advocate Neha Gupta',
      completedTime: '2024-03-13T11:30:00',
      participants: 167,
      duration: '1h 45m',
      recording: true,
      meetingId: 'CC-WS-007'
    }
  ]

  const handleJoinMeeting = (meetingId: string) => {
    // In real implementation, this would integrate with Zoom API
    alert(`Joining meeting: ${meetingId}`)
  }

  const handleCreateMeeting = () => {
    // In real implementation, this would create a Zoom meeting
    alert('Creating new meeting... (Zoom integration required)')
  }

  const handleJoinByCode = () => {
    if (!meetingCode.trim()) {
      alert('Please enter a meeting code')
      return
    }
    alert(`Joining meeting with code: ${meetingCode}`)
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <Layout>
      <Head>
        <title>Video Conference - Indian Advocate Forum</title>
        <meta name="description" content="Join legal conferences, workshops, and court proceedings through video conferencing" />
      </Head>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Video Conferencing</h1>
        <p className="mt-2 text-gray-600">
          Join legal conferences, court hearings, and professional workshops from anywhere
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {isAdmin && (
          <div className="bg-purple-600 text-white rounded-lg p-6">
            <div className="flex items-center mb-3">
              <PlusIcon className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-semibold">Host a Meeting</h3>
            </div>
            <p className="text-purple-100 mb-4 text-sm">
              Create and manage legal conferences as an admin
            </p>
            <button
              onClick={handleCreateMeeting}
              className="w-full bg-white text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Start New Meeting
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center mb-3">
            <LinkIcon className="h-6 w-6 mr-2 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Join by Code</h3>
          </div>
          <p className="text-gray-600 mb-4 text-sm">
            Enter meeting ID to join conference
          </p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter meeting code"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
            <button
              onClick={handleJoinByCode}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-700 transition-colors"
            >
              Join Meeting
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center mb-3">
            <ComputerDesktopIcon className="h-6 w-6 mr-2 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">System Check</h3>
          </div>
          <p className="text-gray-600 mb-4 text-sm">
            Test your camera and microphone
          </p>
          <div className="flex space-x-2">
            <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200">
              <MicrophoneIcon className="h-4 w-4 mx-auto" />
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200">
              <VideoCameraIcon className="h-4 w-4 mx-auto" />
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200">
              <SpeakerWaveIcon className="h-4 w-4 mx-auto" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'live', label: 'Live Meetings', count: liveMeetings.length },
              { id: 'upcoming', label: 'Upcoming', count: upcomingMeetings.length },
              { id: 'recent', label: 'Recent', count: recentMeetings.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'live' && (
            <div className="space-y-4">
              {liveMeetings.length > 0 ? (
                liveMeetings.map((meeting) => (
                  <div key={meeting.id} className="border rounded-lg p-4 bg-red-50 border-red-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                          <h3 className="text-lg font-medium text-gray-900">{meeting.title}</h3>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <UserGroupIcon className="h-4 w-4 mr-1" />
                            <span>Host: {meeting.host}</span>
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span>Started: {formatTime(meeting.startTime)}</span>
                          </div>
                          <div className="flex items-center">
                            <UserPlusIcon className="h-4 w-4 mr-1" />
                            <span>{meeting.participants} participants</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Meeting ID: {meeting.meetingId}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleJoinMeeting(meeting.meetingId)}
                        className="ml-4 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Join Live
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <VideoCameraIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No live meetings at the moment</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'upcoming' && (
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{meeting.title}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-1" />
                          <span>Host: {meeting.host}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarDaysIcon className="h-4 w-4 mr-1" />
                          <span>{formatDate(meeting.scheduledTime)} at {formatTime(meeting.scheduledTime)}</span>
                        </div>
                        <div className="flex items-center">
                          <UserPlusIcon className="h-4 w-4 mr-1" />
                          <span>Expected: {meeting.expectedParticipants} participants</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            meeting.isPublic ? 'bg-green-400' : 'bg-yellow-400'
                          }`}></span>
                          <span>{meeting.isPublic ? 'Public' : 'Private'} Meeting</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Meeting ID: {meeting.meetingId}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 space-y-2">
                      <button
                        onClick={() => alert(`Reminder set for ${meeting.title}`)}
                        className="block w-full bg-purple-100 text-purple-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-200 transition-colors"
                      >
                        Set Reminder
                      </button>
                      {meeting.isPublic && (
                        <button
                          onClick={() => alert(`Added ${meeting.title} to calendar`)}
                          className="block w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          Add to Calendar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recent' && (
            <div className="space-y-4">
              {recentMeetings.map((meeting) => (
                <div key={meeting.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{meeting.title}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-1" />
                          <span>Host: {meeting.host}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarDaysIcon className="h-4 w-4 mr-1" />
                          <span>Completed: {formatDate(meeting.completedTime)}</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>Duration: {meeting.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <UserPlusIcon className="h-4 w-4 mr-1" />
                          <span>{meeting.participants} participants</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Meeting ID: {meeting.meetingId}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {meeting.recording && (
                        <button
                          onClick={() => alert(`Playing recording of ${meeting.title}`)}
                          className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-green-200 transition-colors"
                        >
                          View Recording
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Integration Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-3">
          <VideoCameraIcon className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-blue-900">Zoom Integration</h3>
        </div>
        <p className="text-blue-800 mb-4">
          Our video conferencing system integrates with Zoom to provide secure, high-quality meetings for legal professionals. 
          Admin users can create meetings, and participants can join using meeting codes or invitation links.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded p-3">
            <h4 className="font-medium text-blue-900 mb-1">For Admins</h4>
            <p className="text-blue-700">Create and manage meetings, invite participants, control recording</p>
          </div>
          <div className="bg-white rounded p-3">
            <h4 className="font-medium text-blue-900 mb-1">For Participants</h4>
            <p className="text-blue-700">Join meetings with codes, participate in discussions, access recordings</p>
          </div>
          <div className="bg-white rounded p-3">
            <h4 className="font-medium text-blue-900 mb-1">Security</h4>
            <p className="text-blue-700">End-to-end encryption, waiting rooms, meeting passwords</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}