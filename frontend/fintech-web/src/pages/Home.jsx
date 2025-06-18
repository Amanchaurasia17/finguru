import {useState} from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Lottie from 'react-lottie-player';
import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaRobot, FaPiggyBank, FaCalculator, FaChartLine, FaChevronDown } from 'react-icons/fa';
import Scrollspy from 'react-scrollspy';
import { Link as ScrollLink, Element } from 'react-scroll';
import Footer from '../components/Footer'

import animationData from '../assets/finance-animation.json'; 
import problemAnimation from '../assets/problem-animation.json'; 

export default function Home() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth bg-gradient-to-br from-[#052c44] via-[#0a3c4c] to-[#0c5346] text-white relative">
      
      {/* Navbar */}
      <Navbar />

      {/* Scroll Dot Nav */}
      <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
        <Scrollspy
          items={['hero', 'features', 'problem', 'whyus', 'faq']}
          currentClassName="bg-green-400"
          className="flex flex-col gap-3"
        >
          {['hero', 'features', 'problem', 'whyus', 'faq'].map((id) => (
            <ScrollLink
              key={id}
              to={id}
              smooth
              duration={500}
              className="w-3 h-3 rounded-full bg-gray-500 cursor-pointer hover:bg-green-400 transition"
            />
          ))}
        </Scrollspy>
      </div>

      {/* Hero */}
      <Element name="hero">
        <section className="min-h-screen flex items-center justify-center px-8 md:px-20 pt-[80px] snap-start">
          <div className="flex flex-col md:flex-row items-center justify-between w-full">
            <div className="max-w-xl text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Master Your Money<br />with <span className="text-green-400">FinGURU</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-300">
                All-in-one AI-Powered Financial Platform — track your expenses, optimize taxes, 
                grow investments, and predict stock opportunities smartly.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <Link to="/login" className="bg-transparent border border-green-400 text-green-400 px-6 py-3 rounded-lg font-semibold hover:bg-green-400 hover:text-black transition">
                  Login
                </Link>
                <Link to="/register" className="bg-green-400 hover:bg-green-500 text-black font-semibold px-6 py-3 rounded-lg transition">
                  Get Started
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 mt-10 md:mt-0">
              <Lottie loop animationData={animationData} play className="w-full max-w-md mx-auto" />
            </div>
          </div>
        </section>
      </Element>

      {/* Features */}
      <Element name="features">
        <section className="min-h-screen snap-start pt-[80px] px-6 md:px-20 flex flex-col items-center justify-center bg-[#0a3c4c]">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose <span className="text-green-400">FinGURU?</span>
          </h2>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-[#093241] rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="text-green-400 text-4xl mb-4 mx-auto">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </Element>
      ...

{/* Problem We Solve */}
<Element name="problem">
  <section className="min-h-screen snap-start pt-[80px] px-6 md:px-20 flex flex-col md:flex-row items-center justify-between bg-[#08333e]">

    {/* Text Content */}
    <motion.div
      className="max-w-xl text-center md:text-left"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-6">
        The Financial Struggles We’re Solving
      </h2>
      <p className="text-lg md:text-xl mb-4 text-gray-300 leading-relaxed">
        Managing money shouldn't feel overwhelming — but for millions, it does. From tracking spending to untangling taxes and building wealth, the journey often feels impossible.
      </p>
      <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
        <span className="text-green-400 font-semibold">FinGURU</span> changes that. Our AI-powered platform brings you smart expense tracking, personalized financial planning, and tailored growth strategies — giving you clarity, confidence, and control over your future.
      </p>
    </motion.div>

    {/* Animation */}
    <motion.div
      className="w-full md:w-1/2 mt-10 md:mt-0"
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Lottie
        loop
        play
        animationData={problemAnimation}
        className="w-full max-w-md mx-auto"
      />
    </motion.div>

  </section>
</Element>

...


      {/* Why We're Best */}
      <Element name="whyus">
        <section className="min-h-screen snap-start pt-[80px] px-6 md:px-20 flex flex-col items-center justify-center bg-[#052c44]">
          <motion.div
            className="max-w-5xl text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-10">What Makes <span className="text-green-400">FinGURU</span> Stand Out?</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {whyBest.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-[#093241] p-6 rounded-2xl shadow-lg hover:shadow-2xl transition"
                  whileHover={{ scale: 1.05 }}
                >
                  <h4 className="text-xl font-semibold text-green-400 mb-2">{item.title}</h4>
                  <p className="text-gray-300">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </Element>

      {/* FAQ */}
      <Element name="faq">
        <section className="min-h-screen snap-start flex items-center justify-center px-8 md:px-20 pt-[80px] text-center bg-[#052c44]">
          <div className="max-w-3xl w-full">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="divide-y divide-[#0a3c4c]">
              {faqs.map((faq, index) => (
                <div key={index} className="py-4">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center text-left"
                  >
                    <h4 className="text-lg font-semibold text-green-400">{faq.q}</h4>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaChevronDown className="text-green-400" />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openIndex === index ? 'auto' : 0, opacity: openIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden text-gray-300 mt-2"
                  >
                    {openIndex === index && (
                      <div className="pt-2 text-base leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Element>

    {/* Footer */}
<section className="snap-start">
  <Footer />
</section>

    </div>
  );
}

const features = [
  { icon: <FaMoneyBillWave />, title: "Smart Spending Tracker", description: "Track your expenses with real-time alerts and intelligent dashboards." },
  { icon: <FaRobot />, title: "FinGURU AI Assistant", description: "Get instant AI-driven financial advice tailored to your needs 24/7." },
  { icon: <FaChartLine />, title: "Personalized Investment Plans", description: "AI-generated investment strategies customized for your goals." },
  { icon: <FaCalculator />, title: "Advanced Tax Tools", description: "Optimize taxes with calculators, alerts, and AI-powered savings insights." },
  { icon: <FaPiggyBank />, title: "Budgeting & Saving Goals", description: "Set goals, track progress, and stay disciplined effortlessly." },
  { icon: <FaRobot />, title: "AI Debt Management", description: "Improve your credit and manage debt intelligently with AI." },
];

const whyBest = [
  { title: "Hyper-Personalized AI Advice", description: "We build your financial path using AI, ML & NLP technology tuned to your life." },
  { title: "Real-Time Spending Insights", description: "Always know where your money goes — with alerts, budgets, and reports." },
  { title: "Tax Optimization & Filing", description: "Never overpay taxes again with smart calculators and filing guidance." },
  { title: "Unified Banking Integration", description: "Track everything across banks, credit cards, and investments — all in one place." },
];

const faqs = [
  { q: "Is FinGURU free to use?", a: "Yes! We offer a freemium model. Core tools are free, and premium AI insights are available for pro users." },
  { q: "Is my financial data safe?", a: "Absolutely. We use bank-grade encryption and never share your data without consent." },
  { q: "Can I connect my bank account?", a: "Yes! FinGURU uses secure banking APIs for seamless tracking." },
  { q: "Does it help with taxes?", a: "Totally! You get calculators, tips, alerts, and even AI-based savings insights." },
  { q: "Do you offer investment advice?", a: "FinGURU generates personalized plans using AI based on your risk profile and financial goals." },
];
