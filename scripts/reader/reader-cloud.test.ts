import {describe,it,expect,vi} from 'vitest';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

function setup(remote: any = {state:{position:445,mode:'manual',offset:0,rate:1,bookmarks:[445]},revision:3}) {
  const elements: Record<string,any> = {};
  const element = (id:string) => elements[id] ||= {textContent:'',value:'',hidden:false,setAttribute:vi.fn()};
  let state = {position:10,mode:'manual',offset:0,rate:1,bookmarks:[] as number[]};
  let fail = false;
  const authCallback: {current?:Function} = {};
  const client = {
    from: vi.fn(() => ({select: () => ({eq: () => ({eq: () => ({maybeSingle: async () => ({data:remote,error:null})})})})})),
    rpc: vi.fn(async (_name:string,args:any) => {
      if (fail) return {error: new Error('offline')};
      if (args.p_revision !== (remote?.revision || 0)) return {data:{saved:false}};
      remote = {state:args.p_state,revision:(remote?.revision || 0)+1};
      return {data:{saved:true,revision:remote.revision}};
    }),
    auth: {signUp:vi.fn(async (args:any)=>({data:{session:{user:{id:'new-user',email:args.email,user_metadata:args.options.data}}}})), signInWithPassword:vi.fn(async (args:any)=>({data:{session:{user:{id:'new-user',email:args.email}}}})), onAuthStateChange: (fn:Function) => {authCallback.current=fn;}, getSession:async()=>({data:{session:{user:{id:'user-a',email:'a@ot-tennis.app'}}}})}
  };
  const sandbox:any = {window:{supabase:{createClient:()=>client},addEventListener:()=>{}},document:{querySelector:element,getElementById:element,addEventListener:()=>{}},setTimeout:(f:Function)=>f(),setInterval:()=>{},Date,location:{origin:'https://chung-website.vercel.app',pathname:'/hey-tablo/46'}};
  runInNewContext(readFileSync('scripts/reader/reader-core.js','utf8'),sandbox);
  runInNewContext(readFileSync('scripts/reader/reader-cloud.js','utf8'),sandbox);
  const apply=vi.fn((s:any)=>{state=s;});
  const handle=sandbox.window.attachTabloCloud({cloud:{url:'x',anonKey:'public'},youtube:'_c_2NsYL3ic'},{read:()=>state,apply,account:vi.fn()});
  return {client,handle,apply,element,change:(s:any)=>{state={...state,...s};handle.changed();},get:()=>state,remote:()=>remote,setRemote:(r:any)=>{remote=r;},offline:(v:boolean)=>{fail=v;}};
}
describe('cloud reading progress',()=>{
  it('loads the saved position first, then persists a new seek and bookmarks',async()=>{
    const t=setup(); await vi.waitFor(()=>expect(t.apply).toHaveBeenCalled());
    expect(t.get().position).toBe(445); expect(t.client.rpc).not.toHaveBeenCalled();
    t.change({position:480,bookmarks:[445,480]}); await t.handle.flush(true);
    expect(t.remote().state.position).toBe(480); expect(t.remote().revision).toBe(4);
    expect(t.remote().state.bookmarks).toEqual([445,480]);
  });
  it('does not overwrite newer progress from another device',async()=>{
    const t=setup(); await vi.waitFor(()=>expect(t.apply).toHaveBeenCalled());
    t.setRemote({state:{...t.get(),position:900},revision:4}); t.change({position:450});
    await t.handle.flush(true); expect(t.remote().state.position).toBe(900);
    expect(t.element('reader-cloud-status').textContent).toContain('다른 기기');
    await t.handle.flush(true); expect(t.client.rpc).toHaveBeenCalledTimes(1);
  });
  it('keeps unsaved local changes after network failure and retries',async()=>{
    const t=setup(); await vi.waitFor(()=>expect(t.apply).toHaveBeenCalled());
    t.offline(true); t.change({position:600}); await t.handle.flush(true);
    expect(t.get().position).toBe(600); expect(t.remote().state.position).toBe(445);
    t.offline(false); await t.handle.flush(true); expect(t.remote().state.position).toBe(600);
  });
});

describe('English notes accounts',()=>{
  it('registers a separate account with a name and never uses the tennis email namespace',async()=>{
    const t=setup(null); await new Promise(r=>setTimeout(r,0));
    t.element('reader-auth-signup').onclick();
    t.element('reader-name').value='지수'; t.element('reader-login-id').value='Study_123';
    t.element('reader-password').value=t.element('reader-password-confirm').value='example-password';
    await t.element('reader-login-form').onsubmit({preventDefault(){}});
    expect(t.client.auth.signUp).toHaveBeenCalledWith({email:'study_123@english-notes.chung-website.vercel.app',password:'example-password',options:{data:{display_name:'지수',username:'study_123',app:'english-notes'}}});
    expect(t.element('reader-account').textContent).toContain('지수');
    expect(t.element('reader-password').value).toBe('');
  });
  it('rejects mismatched passwords before sending registration',async()=>{
    const t=setup(); t.element('reader-auth-signup').onclick();
    t.element('reader-name').value='지수';t.element('reader-login-id').value='study_123';
    t.element('reader-password').value='example-password';t.element('reader-password-confirm').value='different';
    await t.element('reader-login-form').onsubmit({preventDefault(){}});
    expect(t.client.auth.signUp).not.toHaveBeenCalled();
  });
  it('logs in only with the dedicated account namespace',async()=>{
    const t=setup();t.element('reader-login-id').value='Study_123';t.element('reader-password').value='example-password';
    await t.element('reader-login-form').onsubmit({preventDefault(){}});
    expect(t.client.auth.signInWithPassword).toHaveBeenCalledWith({email:'study_123@english-notes.chung-website.vercel.app',password:'example-password'});
  });
});
