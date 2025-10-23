interface Department {
  id: string
  name: string
  head: string
  description: string
  subDepartments?: Department[]
}

interface OrgChartProps {
  departments: Department[]
  className?: string
}

const OrgChart = ({ departments, className = '' }: OrgChartProps) => {
  const renderDepartment = (dept: Department, level: number = 0) => (
    <div key={dept.id} className={`${level > 0 ? 'ml-6 mt-4' : ''}`}>
      <div className={`p-4 rounded-lg border-2 ${
        level === 0 
          ? 'bg-brand-primary text-white border-brand-primary' 
          : 'bg-white text-gray-900 border-gray-200'
      }`}>
        <h3 className={`font-semibold ${level === 0 ? 'text-white' : 'text-gray-900'}`}>
          {dept.name}
        </h3>
        <p className={`text-sm mt-1 ${level === 0 ? 'text-blue-100' : 'text-gray-600'}`}>
          {dept.head}
        </p>
        {dept.description && (
          <p className={`text-xs mt-2 ${level === 0 ? 'text-blue-100' : 'text-gray-500'}`}>
            {dept.description}
          </p>
        )}
      </div>
      
      {dept.subDepartments && (
        <div className="mt-4 space-y-2">
          {dept.subDepartments.map(subDept => renderDepartment(subDept, level + 1))}
        </div>
      )}
    </div>
  )

  return (
    <div className={`space-y-4 ${className}`}>
      {departments.map(dept => renderDepartment(dept))}
    </div>
  )
}

export default OrgChart
