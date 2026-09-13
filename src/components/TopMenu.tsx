export function TopMenu() {
  return (
    <div className="top-menu">
      <div className="menu-group">
        <button className="menu-btn">File</button>
        <button className="menu-btn">Edit</button>
        <button className="menu-btn">View</button>
        <button className="menu-btn">Model</button>
        <button className="menu-btn">Animation</button>
        <button className="menu-btn">Help</button>
      </div>

      <div className="menu-spacer"></div>

      <div className="menu-group">
        <span className="status-text">Ready</span>
      </div>
    </div>
  )
}
