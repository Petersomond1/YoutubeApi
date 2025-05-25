//  youtubefront\src\utils\Constants.jsx
import React from 'react';

import { FaHome } from "react-icons/fa";
import { MdSportsEsports } from "react-icons/md";
import { MdLiveTv } from "react-icons/md";
import { MdFaceRetouchingNatural } from "react-icons/md";
import { MdCheckroom } from "react-icons/md";
import { MdGraphicEq } from "react-icons/md";
import { MdTheaterComedy } from "react-icons/md";
import { MdFitnessCenter } from "react-icons/md";
import { MdDeveloperMode } from "react-icons/md";
import { RxStack } from "react-icons/rx";
import { FaCentercode } from "react-icons/fa";
import { IoMdFitness } from "react-icons/io";
import { FaCode } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { GiPeach } from "react-icons/gi";


export const logo = 'https://i.ibb.co/s9Qys2j/logo.png';

export const categories = [
  { name: 'Home', icon:<FaHome/> , },
  { name: 'Atlanta', icon:<GiPeach /> , },
  { name: 'New', icon:<MdGraphicEq/> , },
  { name: 'Fullstack Acadamy', icon:<RxStack/> ,},
  { name: 'Web Development', icon:<FaCode/> , },
  { name: 'Coding', icon:<FaCentercode /> ,},
  { name: 'ReactJS', icon:<FaCode/> , },
  { name: 'NextJS', icon:<FaCode/> ,},
  { name: 'Music', icon:<MdDeveloperMode/> , },
  { name: 'Education',icon: <MdDeveloperMode /> ,},
  { name: 'Podcast', icon:<MdDeveloperMode/> ,},
  { name: 'Movie', icon:<MdDeveloperMode/> , },
  { name: 'Gaming', icon:<MdSportsEsports/> ,},
  { name: 'Live', icon: <MdLiveTv/> , },
  { name: 'Sport', icon: <IoMdFitness/> , },
  { name: 'Fashion', icon: <MdCheckroom/> , },
  { name: 'Beauty', icon:<MdFaceRetouchingNatural /> },
  { name: 'Comedy', icon: <MdTheaterComedy/> , },
  { name: 'Gym', icon: <MdFitnessCenter/>  ,},
  { name: 'Crypto', icon: <MdDeveloperMode/> ,},
  { name: 'Science', icon:<MdDeveloperMode/>  , },
  { name: 'Space', icon: <MdDeveloperMode/> ,},
  { name: 'News', icon: <MdDeveloperMode /> ,},
  { name: 'Art', icon: <MdDeveloperMode />},
  { name: 'Travel', icon: <MdDeveloperMode /> },
  { name: 'Food', icon: <MdDeveloperMode /> },
  { name: 'Photography', icon: <MdDeveloperMode /> },
  { name: 'Design', icon: <MdDeveloperMode /> },
  { name: 'Business', icon: <MdDeveloperMode /> },
  { name: 'Marketing', icon: <MdDeveloperMode /> },
  { name: 'Health', icon: <MdDeveloperMode />},
  { name: 'Lifestyle', icon: <MdDeveloperMode /> },
  { name: 'Motivation', icon: <MdDeveloperMode /> },
  { name: 'History', icon: <MdDeveloperMode /> },
  { name: 'Technology', icon: <MdDeveloperMode /> },
  { name: 'Finance', icon: <MdDeveloperMode /> },
  { name: 'Entertainment', icon: <MdDeveloperMode /> },
  { name: 'DIY', icon: <MdDeveloperMode /> },
  { name: 'Spirituality', icon: <MdDeveloperMode /> },
  { name: 'Animals', icon: <MdDeveloperMode /> },
  { name: 'Cars', icon: <MdDeveloperMode /> },
  { name: 'Dating', icon: <MdDeveloperMode /> },
  { name: 'Politics', icon: <MdDeveloperMode /> },
  { name: 'Video Games', icon: <MdDeveloperMode />},
  { name: 'Nature', icon: <MdDeveloperMode /> },
  { name: 'Family', icon: <MdDeveloperMode /> },
  { name: 'Other', icon: <FaRegCheckCircle /> },
]
  
export const demoThumbnailUrl = 'https://i.ibb.co/G2L2Gwp/API-Course.png';
export const demoChannelUrl = '/channel/UCmXmlB4-HJytD7wek0Uo97A';
export const demoVideoUrl = '/video/GDa8kZLNhJ4';
export const demoChannelTitle = 'JavaScript Mastery';
export const demoVideoTitle = '(Build and Deploy 5 JavaScript & React API Projects in 10 Hours - Full Course | RapidAPI';
export const demoProfilePicture = 'http://dergipark.org.tr/assets/app/images/buddy_sample.jpg';



// //RAPIDAPI DATA JSX

// export const data = {
//     "kind": "youtube#captionListResponse",
//     "items": [
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaZHR-hdtpvJvd_dtt6cuYWaFGFlDocKBzLyQktj",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:09:57.310379Z",
//           "trackKind": "standard",
//           "language": "bg",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaabls5Sj_JBTPLxa9mButbWQUGoslSg8kZ_QABG",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:10:14.31492Z",
//           "trackKind": "standard",
//           "language": "cs",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaYpu3pSVa1cGYcHqZIUxh9gGngs6-uicZIUpL58",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:07:13.379383Z",
//           "trackKind": "standard",
//           "language": "da",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaZUoWgikIECdNMeW06L4dlXEsmzLibHuGiVpGNH",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-22T10:03:05.314327Z",
//           "trackKind": "standard",
//           "language": "de",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaapCopU7k8ts1dVMlDpuAPmsvnJwDPF_69fo8du",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:10:31.456401Z",
//           "trackKind": "standard",
//           "language": "el",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDabtbewAoYf8lCfnfuXcILjAGpv59b7UPZ_y8u4r",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:04:00.666956Z",
//           "trackKind": "standard",
//           "language": "en",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDabbV42G3vRtGWLtxofX62u3wHl_arD2yAbGPhAO",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:23:44.447914Z",
//           "trackKind": "standard",
//           "language": "es",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaZO_5MnUy2F76ZNVwXOgUT9qYrbKYYmGVKBoDBB",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:10:55.051556Z",
//           "trackKind": "standard",
//           "language": "et",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaaU_Zt13X11cYqRwxN5asBvMs0In2joPBGwoW7a",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:07:29.875922Z",
//           "trackKind": "standard",
//           "language": "fi",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDabAn4agJ2kZFMmDtphgpXDMK5CC-iwq3E6X9zpf",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:22:51.130099Z",
//           "trackKind": "standard",
//           "language": "fr",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaa-vVuExNKUww76IfGLtO5mXIruTU4LC8zFVo7M",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:11:33.527812Z",
//           "trackKind": "standard",
//           "language": "hr",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDabB0s6z8bCTpb9xsGJ0krrnuO2Kyw6tg6mM_Shz",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:11:52.281555Z",
//           "trackKind": "standard",
//           "language": "hu",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaZ9gt3Whiq6TYqn8Z_iYVfaQ8LWuRByydqWEFPk",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T10:39:25.354926Z",
//           "trackKind": "standard",
//           "language": "it",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaZzgn-L6_dSYWxIfswwxSijxn-CXB-4axSmR6ox",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:11:15.97086Z",
//           "trackKind": "standard",
//           "language": "iw",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaZZSf7rMltQ5EoWfDPjk6L1QpSh5LIiZpgWKw1x",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:12:32.130675Z",
//           "trackKind": "standard",
//           "language": "lt",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaYnK2OXt0U3XsuTRfAFDs3EDnvGA_5CmrvsfmXM",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:12:52.322594Z",
//           "trackKind": "standard",
//           "language": "lv",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDabCH6Hlajjc_wlbs7KDBkGl82e5IWPs3ne026wH",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:13:24.307402Z",
//           "trackKind": "standard",
//           "language": "mk",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaav3ERlFMevRQ_TObQFEOU3nvW2J1hAyw13XE9h",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:08:18.257433Z",
//           "trackKind": "standard",
//           "language": "nl",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDabGHHhInaVOkXvRhP6U6DNI76Tf04YAmIc761I4",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:23:18.309234Z",
//           "trackKind": "standard",
//           "language": "no",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDabvbTyxWp_n2JkukPjuHvEFRmcnsSmGJf2y3stm",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:23:32.924738Z",
//           "trackKind": "standard",
//           "language": "pl",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaaa-jlw2pAN6eifVufcY6rebTMjFjRUR1xgnkJ3",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:13:47.582389Z",
//           "trackKind": "standard",
//           "language": "pt",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaaIYdQzVQEGSWLNQneoBfCPc9e1UDOJzTyEQZqT",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:13:59.442088Z",
//           "trackKind": "standard",
//           "language": "ro",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaZhUNZc1d0DkzQLY1qJYzNNfKdGcYT6sZO0DKDO",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:04:13.902921Z",
//           "trackKind": "standard",
//           "language": "ru",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDabpX9BFP2wrFL4xZmPoXI0zp2vNMWVut1HXfx79",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:14:15.489424Z",
//           "trackKind": "standard",
//           "language": "sk",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaZD1lPjEhUN4TuxBCRJU7GfRxVtR88gxHHdlZlT",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:14:35.413376Z",
//           "trackKind": "standard",
//           "language": "sl",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaa12d5vtEdF7cYQcKaPL0l7nbbxe9AscfGQlvFk",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:14:51.093553Z",
//           "trackKind": "standard",
//           "language": "sr",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaZdjvBplK_rrejkAWPl9EhlTLMOF47U42-lEXL4",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:24:00.871537Z",
//           "trackKind": "standard",
//           "language": "sv",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaaViVSYLN5EBspxcc_E1bB_QARo49fLU57FtZfH",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:15:26.315686Z",
//           "trackKind": "standard",
//           "language": "tr",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       },
//       {
//         "kind": "youtube#caption",
//         "id": "AUieDaZh7WnRK_ro9ASpMOVKr7eHm6tRsjrgCmgL4pa1",
//         "snippet": {
//           "videoId": "M7FIvfx5J10",
//           "lastUpdated": "2013-11-14T08:15:51.92339Z",
//           "trackKind": "standard",
//           "language": "uk",
//           "name": "",
//           "audioTrackType": "unknown",
//           "isCC": false,
//           "isLarge": false,
//           "isEasyReader": false,
//           "isDraft": false,
//           "isAutoSynced": false,
//           "status": "serving"
//         }
//       }
//     ]
//   };
