<template>
    <div>
        <Form :model="model" :rules="rules" ref="loginForm">
            <!-- prop表单项的标识，用于取值和校验规则 -->
            <FormItem label="用户名" prop="username">
                <FormInput v-model="model.username" placeholder="请输入用户名"></FormInput>
            </FormItem>
            <FormItem label="密码" prop="password">
                <FormInput v-model="model.password" type="password" placeholder="请输入密码"></FormInput>
            </FormItem>
        </Form>
        <button @click="submit">登录</button>
    </div>
</template>

<script>
    import Form from '../components/Form/Form'
    import FormItem from '../components/Form/FormItem'
    import FormInput from '../components/Form/FormInput'
    import Notice from '../components/Notice'
    export default {
        components: {
            Form,FormItem,FormInput,Notice
        },
        data() {
            return {
                model: {
                    username:'',
                    password:''
                },
                rules:{
                    username:{
                        required:true,
                        message:'请输入用户名'
                    },
                    password:{
                        required:true,
                        message:'请输入密码'
                    }
                }
            }
        },
        methods: {
            // 提交表单 通过ref操作
            submit() {
                this.$refs['loginForm'].validate(res=>{
                    this.$create(Notice,{
                            title: "社会你龙哥，人狠话不多！",
                            message: res ? "校验通过！!" : "校验失败！!",
                            duration: 1000
                        }).show()
                    // if(res){
                    //     alert('校验通过！')
                    // }else{
                    //     alert('校验失败！')
                    // }
                })
            }
        },
    }
</script>

<style scoped>

</style>