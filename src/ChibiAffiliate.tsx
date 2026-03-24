import React from 'react';
import {Composition} from 'remotion';
import {Audio} from '@remotion/media';
import {Live2DModel} from '@remotion/live2d'; // hypothetical wrapper


/**
 * Props for the affiliate video.
 */
interface AffiliateProps {
  /** URL or absolute path to the product image */
  productImage: string;
  /** Product name */
  productName: string;
  /** Review text that already includes 【PR】 tag */
  reviewText: string;
  /** Path to the custom BGM (mp3) */
  bgmPath: string;
  /** Path to the Live2D chibi model (moc3) */
  modelPath: string;
  /** Path to the texture PNG folder */
  texturePath: string;
}

export const ChibiAffiliate: React.FC<AffiliateProps> = ({
  productImage,
  productName,
  reviewText,
  bgmPath,
  modelPath,
  texturePath,
}) => {
  const [speechUrl, setSpeechUrl] = React.useState('');
  React.useEffect(() => {
    // fetch speech from Aether via AvatarUI api
    fetch('http://localhost:8010/aether_generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: reviewText })
    })
      .then(res => res.json())
      .then(data => setSpeechUrl(data.audioUrl))
      .catch(err => console.error('Aether fetch error', err));
  }, [reviewText]);
  return (
    <div style={{
      width: '1080px',
      height: '1920px',
      backgroundColor: '#111',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background BGM */}
      <Audio src={bgmPath} volume={0.6} />
{speechUrl && <Audio src={speechUrl} volume={0.8} />}

      {/* Chibi Charlotte floating on the left side */}
      <div style={{position: 'absolute', left: 50, top: 200, width: 300, height: 300}}>
        <Live2DModel
          model={modelPath}
          textures={[`${texturePath}/texture_00.png`, `${texturePath}/texture_01.png`]}
          scale={0.8}
          physics={true}
        />
      </div>

      {/* Product image on the right side */}
      <img
        src={productImage}
        alt={productName}
        style={{
          position: 'absolute',
          right: 50,
          top: 150,
          width: 400,
          height: 400,
          objectFit: 'cover',
          borderRadius: 20,
          boxShadow: '0 0 20px rgba(255,255,255,0.3)',
        }}
      />

      {/* Text overlay */}
      <div style={{position: 'absolute', left: 380, top: 600, right: 50}}>
        <h2 style={{margin: 0, fontSize: '48px', fontFamily: '"Inter", sans-serif'}}>{productName}</h2>
        <p style={{fontSize: '36px', lineHeight: 1.4}}>{reviewText}</p>
      </div>
    </div>
  );
};

/**
 * Register the composition for Remotion CLI.
 */
export const registerChibiAffiliate = () => (
  <Composition
    id="ChibiAffiliate"
    component={ChibiAffiliate}
    durationInFrames={900} // 30 seconds @ 30fps
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      productImage: 'C:/WATSON_APP/RemotionMV/public/images/sample_product.jpg',
      productName: 'サンプル商品',
      reviewText: '【PR】この商品はとても便利です！ただしバッテリーがやや短い点が気になります。',
      bgmPath: 'C:/WATSON_APP/RemotionMV/public/music/custom_bgm.mp3',
      modelPath: 'C:/Users/noriy/Downloads/Vtuberシャルロット/vidu-video-3191588228652614/model.moc3',
      texturePath: 'C:/Users/noriy/Downloads/Vtuberシャルロット/vidu-video-3191588228652614',
    }}
  />
);
