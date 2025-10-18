import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
            Fable Tales
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-2">
            Create Interactive Stories for Your Children
          </p>
          <p className="text-lg text-gray-500">
            AI-powered branching narratives that teach valuable life lessons
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Parent Mode Card */}
          <Link href="/story-setup">
            <div className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-400">
              <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Parent Mode
              </h2>
              <p className="text-gray-600 mb-4">
                Create personalized stories with educational lessons tailored to
                your child's needs
              </p>
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                Create Story →
              </div>
            </div>
          </Link>

          {/* Child Mode Card */}
          <div className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-400 opacity-60">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Child Mode
            </h2>
            <p className="text-gray-600 mb-4">
              Read interactive stories with branching choices and learn valuable
              life lessons
            </p>
            <div className="inline-block bg-gray-200 text-gray-600 px-4 py-2 rounded-full font-medium">
              Coming Soon
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            What Makes Fable Tales Special?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div>
              <div className="text-3xl mb-3">🎨</div>
              <h4 className="font-semibold text-gray-900 mb-2">
                AI-Generated Stories
              </h4>
              <p className="text-sm text-gray-600">
                Unique stories tailored to the lessons you want to teach
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">🌳</div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Branching Narratives
              </h4>
              <p className="text-sm text-gray-600">
                Multiple paths and endings based on your child's choices
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">📖</div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Educational Focus
              </h4>
              <p className="text-sm text-gray-600">
                Every story reinforces important values and life lessons
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-gray-500 text-sm">
          Get started by creating your first story in Parent Mode
        </p>
      </div>
    </div>
  )
}
