import { motion } from "framer-motion";

const technologies = [
  {
    name: "TensorFlow",
    description: "Deep Learning Framework",
    icon: (
      <svg viewBox="0 0 256 274" className="w-12 h-12">
        <path fill="#FF6F00" d="M145.726 42.065v42.07l72.861 42.07v-42.07l-72.861-42.07z"/>
        <path fill="#FF9800" d="M145.726 126.205v42.069l72.861 42.07v-42.07l-72.861-42.069z"/>
        <path fill="#FF6F00" d="M145.726 0v42.065l72.861 42.07v-42.07L145.726 0zM36.413 168.275v42.07l36.431 21.034v-42.07l-36.431-21.034z"/>
        <path fill="#FF9800" d="M36.413 84.135v42.07l36.431 21.035v-42.07l-36.431-21.035zM36.413 0v42.065l36.431 21.035V21.035L36.413 0z"/>
        <path fill="#FFE082" d="M72.844 231.38v-42.07l-36.431 21.035v42.07l36.431-21.035z"/>
        <path fill="#FFCA28" d="M72.844 105.17v42.07l36.431-21.035V84.135l-36.431 21.035zM72.844 147.24v42.07l36.431-21.035v-42.07l-36.431 21.035z"/>
        <path fill="#FFE082" d="M109.275 63.1v42.07l36.431-21.035V42.065L109.275 63.1zM109.275 189.31v42.07l36.431-21.035v-42.07l-36.431 21.035z"/>
      </svg>
    ),
  },
  {
    name: "FastAPI",
    description: "High-Performance API",
    icon: (
      <svg viewBox="0 0 154 154" className="w-12 h-12">
        <circle cx="77" cy="77" r="77" fill="#05998B"/>
        <path fill="#fff" d="M81.375 18.667l-38.75 70H77l-3.875 46.666 38.75-70H77.5l3.875-46.666z"/>
      </svg>
    ),
  },
  {
    name: "Python",
    description: "Core Language",
    icon: (
      <svg viewBox="0 0 256 255" className="w-12 h-12">
        <defs>
          <linearGradient id="python1" x1="12.96%" x2="79.67%" y1="12.04%" y2="78.56%">
            <stop offset="0%" stopColor="#387EB8"/>
            <stop offset="100%" stopColor="#366994"/>
          </linearGradient>
          <linearGradient id="python2" x1="19.13%" x2="90.58%" y1="20.58%" y2="88.51%">
            <stop offset="0%" stopColor="#FFE052"/>
            <stop offset="100%" stopColor="#FFC331"/>
          </linearGradient>
        </defs>
        <path fill="url(#python1)" d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z"/>
        <path fill="url(#python2)" d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z"/>
      </svg>
    ),
  },
  {
    name: "InceptionResNetV2",
    description: "Deep CNN Architecture",
    icon: (
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-lg">IR</span>
      </div>
    ),
  },
];

const TechStackSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Powered by </span>
            <span className="text-primary">Innovation</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built with cutting-edge technologies for maximum performance and reliability
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 text-center group cursor-pointer"
            >
              <div className="mb-4 flex justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                {tech.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-1">{tech.name}</h3>
              <p className="text-sm text-muted-foreground">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
