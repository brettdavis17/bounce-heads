'use client';

export default function DebugEnv() {
  const envVars = Object.entries(process.env)
    .filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
    .sort();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Environment Variables Debug</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Public Environment Variables</h2>
          {envVars.length === 0 ? (
            <p className="text-red-500">No NEXT_PUBLIC_ environment variables found!</p>
          ) : (
            <div className="space-y-2">
              {envVars.map(([key, value]) => (
                <div key={key} className="border-b pb-2">
                  <div className="font-mono text-sm text-blue-600">{key}</div>
                  <div className="font-mono text-xs text-gray-600 mt-1 break-all">
                    {value ? (key.includes('TOKEN') || key.includes('KEY')
                      ? `${value.substring(0, 10)}...${value.substring(value.length - 10)}`
                      : value)
                    : '<empty>'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Specific Variables Check</h2>
          <div className="space-y-3">
            <div>
              <span className="font-semibold">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN:</span>
              <span className={`ml-2 ${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? 'text-green-600' : 'text-red-600'}`}>
                {process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? 'Present' : 'Missing'}
              </span>
            </div>
            <div>
              <span className="font-semibold">NEXT_PUBLIC_ADSENSE_ENABLED:</span>
              <span className={`ml-2 ${process.env.NEXT_PUBLIC_ADSENSE_ENABLED ? 'text-green-600' : 'text-red-600'}`}>
                {process.env.NEXT_PUBLIC_ADSENSE_ENABLED || 'Missing'}
              </span>
            </div>
            <div>
              <span className="font-semibold">NODE_ENV:</span>
              <span className="ml-2">{process.env.NODE_ENV}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">AdSense Test</h2>
          <div className="border-2 border-dashed border-gray-300 p-4 rounded">
            <p>AdSense should show here based on current logic:</p>
            <p>Development mode: {process.env.NODE_ENV === 'development' ? 'YES' : 'NO'}</p>
            <p>AdSense enabled: {process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' ? 'YES' : 'NO'}</p>
            <p>Should show placeholder: {(process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== 'true') ? 'YES' : 'NO'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}