import { registry } from '../EnvStrategy';
import { NodeEnvStrategy } from './node';
import { NextEnvStrategy } from './next';
import { ReactEnvStrategy } from './react';
import { ViteEnvStrategy } from './vite';
import { BrowserEnvStrategy } from './browser';

// Register strategies in order of preference
registry.register(new NodeEnvStrategy());
registry.register(new NextEnvStrategy());
registry.register(new ReactEnvStrategy());
registry.register(new ViteEnvStrategy());
registry.register(new BrowserEnvStrategy());

export * from './node';
export * from './next';
export * from './react';
export * from './vite';
export * from './browser';