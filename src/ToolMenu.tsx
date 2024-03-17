import { useState } from 'react';
import { Tool } from './Core'
import './index.css'

export interface Props {
    selectTool: (tool: Tool) => void
}

export default function ToolMenu(props: Props) {
    const [tool, setTool] = useState<Tool>(Tool.Line);

    function updateTool(tool: Tool) {
        setTool(tool);
        props.selectTool(tool);
    }

    return (
        <div className='center'>
            <div className='tool-menu'>
                <label><input type='radio' className='tool-button' checked={tool === Tool.Erase} onClick={() => updateTool(Tool.Erase)}/>Erase</label>
                <label><input type='radio' className='tool-button' checked={tool === Tool.Line} onClick={() => updateTool(Tool.Line)}/>Line</label>
                <label><input type='radio' className='tool-button' checked={tool === Tool.Rectangle} onClick={() => updateTool(Tool.Rectangle)} />Rectangle</label>
            </div>
        </div>
    )
}