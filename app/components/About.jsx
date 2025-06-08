export default function About() {
  return (
    <section id="about" className="min-h-screen bg-gradient-to-b from-white to-gray-100 px-6 py-20 flex flex-col items-center justify-center text-center">
      <div className="max-w-4xl">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-6">About Us</h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          We are a passionate team driven by a mission to make a difference. Our goal is to empower communities through innovative solutions and meaningful impact. Whether it's education, environment, or empowerment — we believe in the power of unity and purpose.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="bg-white shadow-lg rounded-xl p-6 w-64">
            <h3 className="text-xl font-semibold text-blue-600">Our Mission</h3>
            <p className="text-gray-600 mt-2 text-sm">
              To bring positive change by connecting people and ideas.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 w-64">
            <h3 className="text-xl font-semibold text-green-600">Our Vision</h3>
            <p className="text-gray-600 mt-2 text-sm">
              A better, inclusive world built on compassion and collaboration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
