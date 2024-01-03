(() => {
    if (!window.pluginBridge) {
        console.error('pluginBridge not found')

        return
    }

    const { pluginBridge } = window

    function Counter() {
        const [count, setCount] = ReactCtx.useState(0)

        // 增加计数
        function increment() {
            setCount(count + 1)
        }

        // 渲染计数器组件
        return ReactCtx.createElement(
            'div',
            null,
            ReactCtx.createElement('p', null, `Count: ${count}`),
            ReactCtx.createElement('button', {
                onClick: increment,
                style: {
                    width: '100px',
                    height: '30px',
                    marginTop: '10px',
                    backgroundColor: '#1890ff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }
            }, 'Increment')
        )
    }

    let ReactCtx = pluginBridge.register({
        name: 'demo',
        version: '1.0.0',
        description: 'demo plugin',
        render: Counter,
    })
})()

