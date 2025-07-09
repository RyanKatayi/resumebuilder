import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, FileText, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DeleteResumeButton } from '@/components/DeleteResumeButton'

export default async function Dashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch user's resumes
  const { data: resumes } = await supabase
    .from('resumes')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">My Resumes</h1>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Welcome back, {user.email}
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 transform hover:scale-105">
              <Link href="/upload" aria-label="Upload a new CV to create a professional resume">
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Upload CV
              </Link>
            </Button>
            <form action="/auth/signout" method="post">
              <Button type="submit" variant="outline" className="border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors" aria-label="Sign out of your account">
                <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>

        {/* Resumes Grid */}
        {resumes && resumes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-sm bg-white rounded-xl overflow-hidden hover:scale-[1.02]">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {new Date(resume.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{resume.title}</CardTitle>
                  <CardDescription className="text-gray-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {resume.template} template
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button asChild size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-200">
                      <Link href={`/cv/${resume.id}`} aria-label={`View ${resume.title} resume`}>
                        View CV
                      </Link>
                    </Button>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline" className="flex-1 border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors">
                        <Link href={`/edit/${resume.id}`} aria-label={`Edit ${resume.title} resume`}>
                          Edit
                        </Link>
                      </Button>
                      <DeleteResumeButton resumeId={resume.id} resumeTitle={resume.title} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16 bg-white border-0 shadow-sm rounded-2xl">
            <CardContent>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No resumes yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Create your first professional resume with our AI-powered builder.
              </p>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 transform hover:scale-105">
                <Link href="/upload">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Resume
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}