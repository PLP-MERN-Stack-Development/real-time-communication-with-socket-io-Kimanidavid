function UserList({ users }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {users.length === 0 ? (
        <div style={{ color: '#6c757d', fontStyle: 'italic' }}>No users online</div>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            style={{
              padding: '0.5rem',
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              border: '1px solid #dee2e6',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#28a745',
              }}
            />
            <span style={{ fontSize: '0.9rem' }}>{user.username}</span>
          </div>
        ))
      )}
    </div>
  );
}

export default UserList;
