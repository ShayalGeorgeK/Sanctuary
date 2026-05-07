import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'}/>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-112.5' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>In a world of "fast fashion" and fleeting trends, we believe your wardrobe should be a source of calm, not clutter. Sanctuary was born from a simple idea: that the clothes we wear should feel like a safe haven—a soft place to land at the end of a long day and a boost of quiet confidence when you step out the door.</p>
          <p>Since our launch, we have remained committed to the "slow-made" philosophy. What began as a curated collection of three organic cotton essentials has grown into a full range of lifestyle staples, all while maintaining our promise of ethical production and transparent sourcing.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>We prioritize quality over quantity. By focusing on durable fabrics and ethical craftsmanship, we aim to reduce the noise in your closet and the impact on our planet. We want to help you curate a look that feels less like a costume and more like home.</p>
        </div>
      </div>

      <div className='text-2xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border border-gray-200 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>At Sanctuary, we maintain a standard of excellence. Every fabric is tested for durability, and every seam is inspected for precision. We ensure that our garments stand the test of time, giving you peace of mind now.</p>
        </div>
        <div className='border border-gray-200 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Shopping should be an effortless escape. Our platform is built for speed, offering seamless navigation and swift, carbon-neutral shipping. We bring the boutique to your doorstep, making your daily life much simpler.</p>
        </div>
        <div className='border border-gray-200 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Our dedicated guides are here for you at every turn. We offer personalized styling and a stress-free return process. Your satisfaction is our priority, ensuring that every interaction is as smooth as our fabrics go.</p>
        </div>
      </div>

      <NewsletterBox/>

    </div>
    
  )
}

export default About