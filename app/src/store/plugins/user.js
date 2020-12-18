export default state=>{
    // store初始化的时候，将储存在localstoreage中的状态还原
    if(localStorage){
        const user = JSON.parse(localStorage.getItem('userInfo'))
        if(user){
            // 如果带有命名空间记得加上 'user/login'
            store.commit('login',user)
        }
    }
    // 如果状态发生改变，自动存入localstoreage
    store.subscribe((mutation,state)=>{
        if(mutation.type==='login'){
            const user = JSON.stringify(state.user)
            localStorage.setItem('user',user)
        }else if(mutation.type==='logout'){
            localStorage.removeItem('user')
        }
    })
}