export const ChatHeader = ({ user }) => {
  return (
    <div className="bg-gray-300">
      <div key={user.email} className="flex justify-between items-center p-1">
        <div className="w-full flex items-center justify-between">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="w-full px-1">
            <div className="flex items-center">
              <div className="flex gap-2 font-semibold">
                {user.name}
                {user.isLoggedIn ? (
                  <p className="text-green-400">on</p>
                ) : (
                  <p className="text-red-400">off</p>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
