import { Link } from 'react-router-dom';
import {FaRegCheckCircle } from 'react-icons/fa';
import { demoThumbnailUrl, demoVideoUrl, demoVideoTitle, demoChannelUrl, demoChannelTitle } from '../utils/Constants';
import '../index.css';

const VideoCard = ({video: {id: {videoId}, snippet}}) => {

    return (
        <div className='Videocard1' style={{width:{xs: '100%', md: '320px'}, boxShadow: 'none', borderRadius:'0'}}>
             <div className="videocard2">
            <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
                <img src={snippet?.thumbnails?.high?.url || demoThumbnailUrl} alt={snippet?.title} style={{ height: '180px', width: '358px', objectFit: 'contain' }}/>
            </Link>
            </div>
            <div className="videocard3" style={{ height: '20px'}}>
                <span style={{fontWeight: 'bold', color: '#FFF'}}>
             <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
                 {snippet?.title.slice(0, 30) || demoVideoTitle.slice(0, 30)}
            </Link>
            </span>
            <span style={{fontWeight: 'lighter', color: 'gray'}}>
            <Link to={snippet?.channelId ? `/channel/${snippet?.channelId}` : demoChannelUrl}>
                 {snippet?.channelTitle.slice(0, 30) || demoChannelTitle.slice(0, 30)}
            </Link>
            <FaRegCheckCircle style={{fontSize: '12', color: 'gray', marginLeft: '5px'}}/>
            </span>
            </div>
        </div>
    )
}

export default VideoCard