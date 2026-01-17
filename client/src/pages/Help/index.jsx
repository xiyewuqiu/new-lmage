import { motion } from 'framer-motion';
import {
  CloudArrowUp,
  Image as ImageIcon,
  Star,
  Tag,
  ShieldCheck,
  DeviceMobile,
  Question,
  Lifebuoy,
  GithubLogo,
  Envelope
} from '@phosphor-icons/react';

const HelpPage = () => {
  const faqs = [
    {
      question: '我要怎么涂鸦？',
      answer: '拖拽图片，点击选择，或者直接粘贴 (Ctrl+V)。小菜一碟。',
    },
    {
      question: '支持什么纸张格式？',
      answer: 'PNG, JPG, JPEG, GIF, WebP, SVG。标准格式都行。',
    },
    {
      question: '能画多大？',
      answer: '每张最大 10MB。保持轻盈。',
    },
    {
      question: '是永久的吗？',
      answer: '是的，通过 Telegram API 安全存储。永不褪色。',
    },
    {
      question: '怎么整理？',
      answer: '用图库查看，用星星收藏，用标签分类。',
    },
  ];

  const FeatureCard = ({ Icon, title, desc }) => (
    <div className="flex flex-col items-center text-center p-4 border-b-2 border-dashed border-gray-200 last:border-0 md:border-b-0 md:border-r-2 last:md:border-r-0">
       <div className="text-pencil mb-2"><Icon size={32} /></div>
       <h3 className="font-hand font-bold text-xl mb-1">{title}</h3>
       <p className="font-hand text-sm text-gray-500">{desc}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-hand font-bold text-pencil rotate-slight-1">
          <Lifebuoy className="inline mr-2 text-marker-blue" />
          帮助指南
        </h1>
        <p className="text-xl text-gray-400 font-hand mt-2 rotate-slight-n1">
          如何使用这本手账
        </p>
      </div>

      {/* Features Grid (Table of Contents style) */}
      <div className="bg-white p-6 shadow-sketch border border-gray-200 rotate-slight-n1 mb-12 relative rounded-sm">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 backdrop-blur-sm -rotate-1 shadow-tape"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <FeatureCard Icon={CloudArrowUp} title="快速涂鸦" desc="拖拽，放下，粘贴。" />
           <FeatureCard Icon={Tag} title="贴标签" desc="标签和收藏。" />
           <FeatureCard Icon={ShieldCheck} title="安全" desc="安全存储。" />
        </div>
      </div>

      {/* FAQ Scraps */}
      <div className="mb-12">
         <h2 className="text-3xl font-hand font-bold text-pencil mb-8 text-center border-b-2 border-marker-pink inline-block px-4 mx-auto rotate-1">
           <Question className="inline mr-2" /> 常问问题
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className={`bg-white p-6 shadow-sketch border border-gray-200 relative ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/40 backdrop-blur-sm shadow-tape"></div>
                <h3 className="font-hand font-bold text-xl text-pencil mb-2">{faq.question}</h3>
                <p className="font-hand text-gray-600">{faq.answer}</p>
              </div>
            ))}
         </div>
      </div>

      {/* Contact Card */}
      <div className="max-w-md mx-auto bg-white p-8 shadow-sketch border border-gray-200 rotate-2 relative transform transition-transform hover:scale-105">
         <div className="absolute top-2 right-2 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-dashed border-gray-300">
            <Lifebuoy size={24} className="text-gray-400" />
         </div>
         <h3 className="font-hand font-bold text-2xl text-pencil mb-4">还是搞不懂？</h3>
         <p className="font-hand text-gray-600 mb-6">
           如果找不到答案，往建议箱里投个条子。
         </p>
         <div className="flex gap-4">
            <a 
              href="https://github.com/xiyewuqiu/new-lmage/issues" 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 btn-doodle text-center flex items-center justify-center gap-2"
            >
              <GithubLogo size={20} /> GitHub
            </a>
            <a 
              href="mailto:support@tg-image.com" 
              className="flex-1 btn-primary text-center flex items-center justify-center gap-2"
            >
              <Envelope size={20} /> 邮件
            </a>
         </div>
      </div>

    </div>
  );
};

export default HelpPage;
