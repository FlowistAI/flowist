// 生成 id
export function generateId() {
    let id = '';

    // 字母部分
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < letters.length; i++) {
        id += letters[i];
        if (id.length === 2) break;
    }

    // 数字部分
    const nums = Math.floor(Math.random() * 1000);
    id += nums;

    return id;
}
